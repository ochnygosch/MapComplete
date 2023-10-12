import {
    Concat,
    Conversion,
    ConversionContext,
    DesugaringContext,
    DesugaringStep,
    Each,
    FirstOf,
    Fuse,
    On,
    SetDefault,
} from "./Conversion"
import { LayerConfigJson } from "../Json/LayerConfigJson"
import {
    MinimalTagRenderingConfigJson,
    TagRenderingConfigJson,
} from "../Json/TagRenderingConfigJson"
import { Utils } from "../../../Utils"
import RewritableConfigJson from "../Json/RewritableConfigJson"
import SpecialVisualizations from "../../../UI/SpecialVisualizations"
import Translations from "../../../UI/i18n/Translations"
import { Translation } from "../../../UI/i18n/Translation"
import tagrenderingconfigmeta from "../../../../src/assets/schemas/tagrenderingconfigmeta.json"
import { AddContextToTranslations } from "./AddContextToTranslations"
import FilterConfigJson from "../Json/FilterConfigJson"
import predifined_filters from "../../../../assets/layers/filters/filters.json"
import { TagConfigJson } from "../Json/TagConfigJson"
import PointRenderingConfigJson, { IconConfigJson } from "../Json/PointRenderingConfigJson"
import ValidationUtils from "./ValidationUtils"
import { RenderingSpecification } from "../../../UI/SpecialVisualization"
import { QuestionableTagRenderingConfigJson } from "../Json/QuestionableTagRenderingConfigJson"
import { ConfigMeta } from "../../../UI/Studio/configMeta"
import LineRenderingConfigJson from "../Json/LineRenderingConfigJson"

class ExpandFilter extends DesugaringStep<LayerConfigJson> {
    private static readonly predefinedFilters = ExpandFilter.load_filters()
    private _state: DesugaringContext

    constructor(state: DesugaringContext) {
        super(
            "Expands filters: replaces a shorthand by the value found in 'filters.json'. If the string is formatted 'layername.filtername, it will be looked up into that layer instead",
            ["filter"],
            "ExpandFilter"
        )
        this._state = state
    }

    private static load_filters(): Map<string, FilterConfigJson> {
        let filters = new Map<string, FilterConfigJson>()
        for (const filter of <FilterConfigJson[]>predifined_filters.filter) {
            filters.set(filter.id, filter)
        }
        return filters
    }

    convert(json: LayerConfigJson, context: ConversionContext): LayerConfigJson {
        if (json?.filter === undefined || json?.filter === null) {
            return json // Nothing to change here
        }

        if (json.filter["sameAs"] !== undefined) {
            return json // Nothing to change here
        }

        const newFilters: FilterConfigJson[] = []
        for (const filter of <(FilterConfigJson | string)[]>json.filter) {
            if (typeof filter !== "string") {
                newFilters.push(filter)
                continue
            }
            if (filter.indexOf(".") > 0) {
                if (this._state.sharedLayers.size > 0) {
                    const split = filter.split(".")
                    if (split.length > 2) {
                        context.err(
                            "invalid filter name: " + filter + ", expected `layername.filterid`"
                        )
                    }
                    const layer = this._state.sharedLayers.get(split[0])
                    if (layer === undefined) {
                        context.err("Layer '" + split[0] + "' not found")
                    }
                    const expectedId = split[1]
                    const expandedFilter = (<(FilterConfigJson | string)[]>layer.filter).find(
                        (f) => typeof f !== "string" && f.id === expectedId
                    )
                    newFilters.push(<FilterConfigJson>expandedFilter)
                } else {
                    // This is a bootstrapping-run, we can safely ignore this
                }
                continue
            }
            // Search for the filter:
            const found = ExpandFilter.predefinedFilters.get(filter)
            if (found === undefined) {
                const suggestions = Utils.sortedByLevenshteinDistance(
                    filter,
                    Array.from(ExpandFilter.predefinedFilters.keys()),
                    (t) => t
                )
                context
                    .enter(filter)
                    .err(
                        "While searching for predefined filter " +
                            filter +
                            ": this filter is not found. Perhaps you meant one of: " +
                            suggestions
                    )
            }
            newFilters.push(found)
        }
        return { ...json, filter: newFilters }
    }
}

class ExpandTagRendering extends Conversion<
    | string
    | TagRenderingConfigJson
    | {
          builtin: string | string[]
          override: any
      },
    TagRenderingConfigJson[]
> {
    private readonly _state: DesugaringContext
    private readonly _tagRenderingsByLabel: Map<string, TagRenderingConfigJson[]>
    // Only used for self-reference
    private readonly _self: LayerConfigJson
    private readonly _options: {
        /* If true, will copy the 'osmSource'-tags into the condition */
        applyCondition?: true | boolean
        noHardcodedStrings?: false | boolean
    }

    constructor(
        state: DesugaringContext,
        self: LayerConfigJson,
        options?: {
            applyCondition?: true | boolean
            noHardcodedStrings?: false | boolean
        }
    ) {
        super(
            "Converts a tagRenderingSpec into the full tagRendering, e.g. by substituting the tagRendering by the shared-question",
            [],
            "ExpandTagRendering"
        )
        this._state = state
        this._self = self
        this._options = options
        this._tagRenderingsByLabel = new Map<string, TagRenderingConfigJson[]>()
        for (const trconfig of state.tagRenderings?.values() ?? []) {
            for (const label of trconfig["labels"] ?? []) {
                let withLabel = this._tagRenderingsByLabel.get(label)
                if (withLabel === undefined) {
                    withLabel = []
                    this._tagRenderingsByLabel.set(label, withLabel)
                }
                withLabel.push(trconfig)
            }
        }
    }

    public convert(
        spec: string | any,
        ctx: ConversionContext
    ): QuestionableTagRenderingConfigJson[] {
        const trs = this.convertOnce(spec, ctx)

        const result = []
        for (const tr of trs) {
            if (typeof tr === "string" || tr["builtin"] !== undefined) {
                const stable = this.convert(tr, ctx.inOperation("recursive_resolve"))
                result.push(...stable)
            } else {
                result.push(tr)
            }
        }

        return result
    }

    private lookup(name: string): TagRenderingConfigJson[] | undefined {
        const direct = this.directLookup(name)

        if (direct === undefined) {
            return undefined
        }
        const result: TagRenderingConfigJson[] = []
        for (const tagRenderingConfigJson of direct) {
            let nm: string | string[] | undefined = tagRenderingConfigJson["builtin"]
            if (nm !== undefined) {
                let indirect: TagRenderingConfigJson[]
                if (typeof nm === "string") {
                    indirect = this.lookup(nm)
                } else {
                    indirect = [].concat(...nm.map((n) => this.lookup(n)))
                }
                for (let foundTr of indirect) {
                    foundTr = Utils.Clone<any>(foundTr)
                    Utils.Merge(tagRenderingConfigJson["override"] ?? {}, foundTr)
                    foundTr["id"] = tagRenderingConfigJson["id"] ?? foundTr["id"]
                    result.push(foundTr)
                }
            } else {
                result.push(tagRenderingConfigJson)
            }
        }
        return result
    }

    /**
     * Looks up a tagRendering or group of tagRenderings based on the name.
     */
    private directLookup(name: string): TagRenderingConfigJson[] | undefined {
        const state = this._state
        if (state.tagRenderings.has(name)) {
            return [state.tagRenderings.get(name)]
        }
        if (this._tagRenderingsByLabel.has(name)) {
            return this._tagRenderingsByLabel.get(name)
        }

        if (name.indexOf(".") < 0) {
            return undefined
        }

        const spl = name.split(".")
        let layer = state.sharedLayers?.get(spl[0])
        if (spl[0] === this._self?.id) {
            layer = this._self
        }

        if (spl.length !== 2 || !layer) {
            return undefined
        }

        const id = spl[1]

        const layerTrs = <TagRenderingConfigJson[]>(
            layer.tagRenderings.filter((tr) => tr["id"] !== undefined)
        )
        let matchingTrs: TagRenderingConfigJson[]
        if (id === "*") {
            matchingTrs = layerTrs
        } else if (id.startsWith("*")) {
            const id_ = id.substring(1)
            matchingTrs = layerTrs.filter((tr) => tr["labels"]?.indexOf(id_) >= 0)
        } else {
            matchingTrs = layerTrs.filter((tr) => tr["id"] === id || tr["labels"]?.indexOf(id) >= 0)
        }

        const contextWriter = new AddContextToTranslations<TagRenderingConfigJson>("layers:")
        for (let i = 0; i < matchingTrs.length; i++) {
            let found: TagRenderingConfigJson = Utils.Clone(matchingTrs[i])
            if (this._options?.applyCondition) {
                // The matched tagRenderings are 'stolen' from another layer. This means that they must match the layer condition before being shown
                if (typeof layer.source !== "string") {
                    if (found.condition === undefined) {
                        found.condition = layer.source["osmTags"]
                    } else {
                        found.condition = { and: [found.condition, layer.source["osmTags"]] }
                    }
                }
            }

            found = contextWriter.convertStrict(
                found,
                ConversionContext.construct(
                    [layer.id, "tagRenderings", found["id"]],
                    ["AddContextToTranslations"]
                )
            )
            matchingTrs[i] = found
        }

        if (matchingTrs.length !== 0) {
            return matchingTrs
        }
        return undefined
    }

    private convertOnce(tr: string | any, ctx: ConversionContext): TagRenderingConfigJson[] {
        const state = this._state

        if (typeof tr === "string") {
            let lookup
            if (this._state.tagRenderings !== null) {
                lookup = this.lookup(tr)
            }
            if (lookup === undefined) {
                if (this._state.sharedLayers?.size > 0) {
                    ctx.warn(
                        `A literal rendering was detected: ${tr}
                      Did you perhaps forgot to add a layer name as 'layername.${tr}'? ` +
                            Array.from(state.sharedLayers.keys()).join(", ")
                    )
                }

                if (this._options?.noHardcodedStrings && this._state?.sharedLayers?.size > 0) {
                    ctx.err(
                        "Detected an invocation to a builtin tagRendering, but this tagrendering was not found: " +
                            tr +
                            " \n    Did you perhaps forget to add the layer as prefix, such as `icons." +
                            tr +
                            "`? "
                    )
                }

                return [
                    <any>{
                        render: tr,
                        id: tr.replace(/[^a-zA-Z0-9]/g, ""),
                    },
                ]
            }
            return lookup
        }

        if (tr["builtin"] !== undefined) {
            let names: string | string[] = tr["builtin"]
            if (typeof names === "string") {
                names = [names]
            }

            if (this._state.tagRenderings === null) {
                return []
            }

            for (const key of Object.keys(tr)) {
                if (
                    key === "builtin" ||
                    key === "override" ||
                    key === "id" ||
                    key.startsWith("#")
                ) {
                    continue
                }
                ctx.err(
                    "An object calling a builtin can only have keys `builtin` or `override`, but a key with name `" +
                        key +
                        "` was found. This won't be picked up! The full object is: " +
                        JSON.stringify(tr)
                )
            }

            const trs: TagRenderingConfigJson[] = []
            for (const name of names) {
                const lookup = this.lookup(name)
                if (lookup === undefined) {
                    let candidates = Array.from(state.tagRenderings.keys())
                    if (name.indexOf(".") > 0) {
                        const [layerName] = name.split(".")
                        let layer = state.sharedLayers.get(layerName)
                        if (layerName === this._self?.id) {
                            layer = this._self
                        }
                        if (layer === undefined) {
                            const candidates = Utils.sortedByLevenshteinDistance(
                                layerName,
                                Array.from(state.sharedLayers.keys()),
                                (s) => s
                            )
                            if (state.sharedLayers.size === 0) {
                                ctx.warn(
                                    "BOOTSTRAPPING. Rerun generate layeroverview. While reusing tagrendering: " +
                                        name +
                                        ": layer " +
                                        layerName +
                                        " not found for now, but ignoring as this is a bootstrapping run. "
                                )
                            } else {
                                ctx.err(
                                    ": While reusing tagrendering: " +
                                        name +
                                        ": layer " +
                                        layerName +
                                        " not found. Maybe you meant one of " +
                                        candidates.slice(0, 3).join(", ")
                                )
                            }
                            continue
                        }
                        candidates = Utils.NoNull(layer.tagRenderings.map((tr) => tr["id"])).map(
                            (id) => layerName + "." + id
                        )
                    }
                    candidates = Utils.sortedByLevenshteinDistance(name, candidates, (i) => i)
                    ctx.err(
                        "The tagRendering with identifier " +
                            name +
                            " was not found.\n\tDid you mean one of " +
                            candidates.join(", ") +
                            "?\n(Hint: did you add a new label and are you trying to use this label at the same time? Run 'reset:layeroverview' first"
                    )
                    continue
                }
                for (let foundTr of lookup) {
                    foundTr = Utils.Clone<any>(foundTr)
                    Utils.Merge(tr["override"] ?? {}, foundTr)
                    if (names.length == 1) {
                        foundTr["id"] = tr["id"] ?? foundTr["id"]
                    }
                    trs.push(foundTr)
                }
            }
            return trs
        }

        return [tr]
    }
}

class DetectInline extends DesugaringStep<QuestionableTagRenderingConfigJson> {
    constructor() {
        super(
            "If no 'inline' is set on the freeform key, it will be automatically added. If no special renderings are used, it'll be set to true",
            ["freeform.inline"],
            "DetectInline"
        )
    }

    convert(
        json: QuestionableTagRenderingConfigJson,
        context: ConversionContext
    ): QuestionableTagRenderingConfigJson {
        if (json.freeform === undefined) {
            return json
        }
        let spec: Record<string, string>
        if (typeof json.render === "string") {
            spec = { "*": json.render }
        } else {
            spec = <Record<string, string>>json.render
        }
        for (const key in spec) {
            if (spec[key].indexOf("<a ") >= 0) {
                // We have a link element, it probably contains something that needs to be substituted...
                // Let's play this safe and not inline it
                return json
            }
            const fullSpecification = SpecialVisualizations.constructSpecification(spec[key])
            if (fullSpecification.length > 1) {
                // We found a special rendering!
                if (json.freeform.inline === true) {
                    context.err(
                        "'inline' is set, but the rendering contains a special visualisation...\n    " +
                            spec[key]
                    )
                }
                json = JSON.parse(JSON.stringify(json))
                json.freeform.inline = false
                return json
            }
        }
        json = JSON.parse(JSON.stringify(json))
        if (typeof json.freeform === "string") {
            context.err("'freeform' is a string, but should be an object")
            return json
        }
        json.freeform.inline ??= true
        return json
    }
}

export class AddQuestionBox extends DesugaringStep<LayerConfigJson> {
    constructor() {
        super(
            "Adds a 'questions'-object if no question element is added yet",
            ["tagRenderings"],
            "AddQuestionBox"
        )
    }

    convert(json: LayerConfigJson, context: ConversionContext): LayerConfigJson {
        if (
            json.tagRenderings === undefined ||
            json.tagRenderings.some((tr) => tr["id"] === "leftover-questions")
        ) {
            return json
        }
        json = JSON.parse(JSON.stringify(json))
        const allSpecials: Exclude<RenderingSpecification, string>[] = []
            .concat(
                ...json.tagRenderings.map((tr) =>
                    ValidationUtils.getSpecialVisualsationsWithArgs(<TagRenderingConfigJson>tr)
                )
            )
            .filter((spec) => typeof spec !== "string")

        const questionSpecials = allSpecials.filter((sp) => sp.func.funcName === "questions")
        const noLabels = questionSpecials.filter(
            (sp) => sp.args.length === 0 || sp.args[0].trim() === ""
        )

        if (noLabels.length > 1) {
            context.err(
                "Multiple 'questions'-visualisations found which would show _all_ questions. Don't do this"
            )
        }

        // ALl labels that are used in this layer
        const allLabels = new Set(
            [].concat(
                ...json.tagRenderings.map(
                    (tr) => (<QuestionableTagRenderingConfigJson>tr).labels ?? []
                )
            )
        )
        const seen = new Set()
        for (const questionSpecial of questionSpecials) {
            if (typeof questionSpecial === "string") {
                continue
            }
            const used = questionSpecial.args[0]
                ?.split(";")
                ?.map((a) => a.trim())
                ?.filter((s) => s != "")
            const blacklisted = questionSpecial.args[1]
                ?.split(";")
                ?.map((a) => a.trim())
                ?.filter((s) => s != "")
            if (blacklisted?.length > 0 && used?.length > 0) {
                context.err(
                    "The {questions()}-special rendering only supports either a blacklist OR a whitelist, but not both." +
                        "\n    Whitelisted: " +
                        used.join(", ") +
                        "\n    Blacklisted: " +
                        blacklisted.join(", ")
                )
            }
            for (const usedLabel of used) {
                if (!allLabels.has(usedLabel)) {
                    context.err(
                        "This layers specifies a special question element for label `" +
                            usedLabel +
                            "`, but this label doesn't exist.\n" +
                            "    Available labels are " +
                            Array.from(allLabels).join(", ")
                    )
                }
                seen.add(usedLabel)
            }
        }

        if (noLabels.length == 0) {
            /* At this point, we know which question labels are not yet handled and which already are handled, and we
             * know there is no previous catch-all questions
             */
            const question: QuestionableTagRenderingConfigJson = {
                id: "leftover-questions",
                render: {
                    "*": `{questions( ,${Array.from(seen).join(";")})}`,
                },
            }
            json.tagRenderings.push(question)
        }
        return json
    }
}

export class AddEditingElements extends DesugaringStep<LayerConfigJson> {
    private readonly _desugaring: DesugaringContext

    constructor(desugaring: DesugaringContext) {
        super(
            "Add some editing elements, such as the delete button or the move button if they are configured. These used to be handled by the feature info box, but this has been replaced by special visualisation elements",
            [],
            "AddEditingElements"
        )
        this._desugaring = desugaring
    }

    convert(json: LayerConfigJson, context: ConversionContext): LayerConfigJson {
        if (this._desugaring.tagRenderings === null) {
            return json
        }
        json = JSON.parse(JSON.stringify(json))

        if (
            json.tagRenderings &&
            this._desugaring.tagRenderings.has("just_created") &&
            !json.tagRenderings.some((tr) => tr === "just_created" || tr["id"] === "just_created")
        ) {
            json.tagRenderings.unshift(this._desugaring.tagRenderings.get("just_created"))
        }

        if (json.allowSplit && !ValidationUtils.hasSpecialVisualisation(json, "split_button")) {
            json.tagRenderings ??= []
            json.tagRenderings.push({
                id: "split-button",
                render: { "*": "{split_button()}" },
            })
            delete json.allowSplit
        }

        if (json.allowMove && !ValidationUtils.hasSpecialVisualisation(json, "move_button")) {
            json.tagRenderings ??= []
            json.tagRenderings.push({
                id: "move-button",
                render: { "*": "{move_button()}" },
            })
        }
        if (json.deletion && !ValidationUtils.hasSpecialVisualisation(json, "delete_button")) {
            json.tagRenderings.push({
                id: "delete-button",
                render: { "*": "{delete_button()}" },
            })
        }

        if (
            json.source !== "special" &&
            json.source !== "special:library" &&
            json.tagRenderings &&
            this._desugaring.tagRenderings.has("last_edit") &&
            !json.tagRenderings.some((tr) => tr["id"] === "last_edit")
        ) {
            json.tagRenderings.push(this._desugaring.tagRenderings.get("last_edit"))
        }

        if (!ValidationUtils.hasSpecialVisualisation(json, "all_tags")) {
            const trc: QuestionableTagRenderingConfigJson = {
                id: "all-tags",
                render: { "*": "{all_tags()}" },

                metacondition: {
                    or: [
                        "__featureSwitchIsDebugging=true",
                        "mapcomplete-show_tags=full",
                        "mapcomplete-show_debug=yes",
                    ],
                },
            }
            json.tagRenderings?.push(trc)
        }

        return json
    }
}

export class ExpandRewrite<T> extends Conversion<T | RewritableConfigJson<T>, T[]> {
    constructor() {
        super("Applies a rewrite", [], "ExpandRewrite")
    }

    /**
     * Used for left|right group creation and replacement.
     * Every 'keyToRewrite' will be replaced with 'target' recursively. This substitution will happen in place in the object 'tr'
     *
     * // should substitute strings
     * const spec = {
     *   "someKey": "somevalue {xyz}"
     * }
     * ExpandRewrite.RewriteParts("{xyz}", "rewritten", spec) // => {"someKey": "somevalue rewritten"}
     *
     * // should substitute all occurances in strings
     * const spec = {
     *   "someKey": "The left|right side has {key:left|right}"
     * }
     * ExpandRewrite.RewriteParts("left|right", "left", spec) // => {"someKey": "The left side has {key:left}"}
     *
     */
    public static RewriteParts<T>(keyToRewrite: string, target: string | any, tr: T): T {
        const targetIsTranslation = Translations.isProbablyATranslation(target)

        function replaceRecursive(obj: string | any, target) {
            if (obj === keyToRewrite) {
                return target
            }

            if (typeof obj === "string") {
                // This is a simple string - we do a simple replace
                while (obj.indexOf(keyToRewrite) >= 0) {
                    obj = obj.replace(keyToRewrite, target)
                }
                return obj
            }
            if (Array.isArray(obj)) {
                // This is a list of items
                return obj.map((o) => replaceRecursive(o, target))
            }

            if (typeof obj === "object") {
                obj = { ...obj }

                const isTr = targetIsTranslation && Translations.isProbablyATranslation(obj)

                for (const key in obj) {
                    let subtarget = target
                    if (isTr && target[key] !== undefined) {
                        // The target is a translation AND the current object is a translation
                        // This means we should recursively replace with the translated value
                        subtarget = target[key]
                    }

                    obj[key] = replaceRecursive(obj[key], subtarget)
                }
                return obj
            }
            return obj
        }

        return replaceRecursive(tr, target)
    }

    /**
     * // should convert simple strings
     * const spec = <RewritableConfigJson<string>>{
     *     rewrite: {
     *         sourceString: ["xyz","abc"],
     *         into: [
     *             ["X", "A"],
     *             ["Y", "B"],
     *             ["Z", "C"]],
     *     },
     *     renderings: "The value of xyz is abc"
     * }
     * new ExpandRewrite().convertStrict(spec, ConversionContext.test()) // => ["The value of X is A", "The value of Y is B", "The value of Z is C"]
     *
     * // should rewrite with translations
     * const spec = <RewritableConfigJson<any>>{
     *     rewrite: {
     *         sourceString: ["xyz","abc"],
     *         into: [
     *             ["X", {en: "value", nl: "waarde"}],
     *             ["Y", {en: "some other value", nl: "een andere waarde"}],
     *     },
     *     renderings: {en: "The value of xyz is abc", nl: "De waarde van xyz is abc"}
     * }
     * const expected = [
     *  {
     *      en: "The value of X is value",
     *      nl: "De waarde van X is waarde"
     *  },
     *  {
     *      en: "The value of Y is some other value",
     *      nl: "De waarde van Y is een andere waarde"
     *  }
     * ]
     * new ExpandRewrite().convertStrict(spec, ConversionContext.test()) // => expected
     */
    convert(json: T | RewritableConfigJson<T>, context: ConversionContext): T[] {
        if (json === null || json === undefined) {
            return []
        }

        if (json["rewrite"] === undefined) {
            // not a rewrite
            return [<T>json]
        }

        const rewrite = <RewritableConfigJson<T>>json
        const keysToRewrite = rewrite.rewrite
        const ts: T[] = []

        {
            // sanity check: rewrite: ["xyz", "longer_xyz"] is not allowed as "longer_xyz" will never be triggered
            for (let i = 0; i < keysToRewrite.sourceString.length; i++) {
                const guard = keysToRewrite.sourceString[i]
                for (let j = i + 1; j < keysToRewrite.sourceString.length; j++) {
                    const toRewrite = keysToRewrite.sourceString[j]
                    if (toRewrite.indexOf(guard) >= 0) {
                        context.err(
                            `sourcestring[${i}] is a substring of sourcestring[${j}]: ${guard} will be substituted away before ${toRewrite} is reached.`
                        )
                    }
                }
            }
        }

        {
            // sanity check: {rewrite: ["a", "b"] should have the right amount of 'intos' in every case
            for (let i = 0; i < rewrite.rewrite.into.length; i++) {
                const into = keysToRewrite.into[i]
                if (into.length !== rewrite.rewrite.sourceString.length) {
                    context
                        .enters("into", i)
                        .err(
                            `Error in rewrite: there are ${rewrite.rewrite.sourceString.length} keys to rewrite, but entry ${i} has only ${into.length} values`
                        )
                }
            }
        }

        for (let i = 0; i < keysToRewrite.into.length; i++) {
            let t = Utils.Clone(rewrite.renderings)
            for (let j = 0; j < keysToRewrite.sourceString.length; j++) {
                const key = keysToRewrite.sourceString[j]
                const target = keysToRewrite.into[i][j]
                t = ExpandRewrite.RewriteParts(key, target, t)
            }
            ts.push(t)
        }

        return ts
    }
}

/**
 * Converts a 'special' translation into a regular translation which uses parameters
 */
export class RewriteSpecial extends DesugaringStep<TagRenderingConfigJson> {
    constructor() {
        super(
            "Converts a 'special' translation into a regular translation which uses parameters",
            ["special"],
            "RewriteSpecial"
        )
    }

    /**
     * Does the heavy lifting and conversion
     *
     * // should not do anything if no 'special'-key is present
     * RewriteSpecial.convertIfNeeded({"en": "xyz", "nl": "abc"}, ConversionContext.test()) // => {"en": "xyz", "nl": "abc"}
     *
     * // should handle a simple special case
     * RewriteSpecial.convertIfNeeded({"special": {"type":"image_carousel"}}, ConversionContext.test()) // => {'*': "{image_carousel()}"}
     *
     * // should handle special case with a parameter
     * RewriteSpecial.convertIfNeeded({"special": {"type":"image_carousel", "image_key": "some_image_key"}}, ConversionContext.test()) // =>  {'*': "{image_carousel(some_image_key)}"}
     *
     * // should handle special case with a translated parameter
     * const spec = {"special": {"type":"image_upload", "label": {"en": "Add a picture to this object", "nl": "Voeg een afbeelding toe"}}}
     * const r = RewriteSpecial.convertIfNeeded(spec, ConversionContext.test())
     * r // => {"en": "{image_upload(,Add a picture to this object)}", "nl": "{image_upload(,Voeg een afbeelding toe)}" }
     *
     * // should handle special case with a prefix and postfix
     * const spec = {"special": {"type":"image_upload" }, before: {"en": "PREFIX "}, after: {"en": " POSTFIX", nl: " Achtervoegsel"} }
     * const r = RewriteSpecial.convertIfNeeded(spec, ConversionContext.test())
     * r // => {"en": "PREFIX {image_upload(,)} POSTFIX", "nl": "PREFIX {image_upload(,)} Achtervoegsel" }
     *
     * // should warn for unexpected keys
     * const context = ConversionContext.test()
     * RewriteSpecial.convertIfNeeded({"special": {type: "image_carousel"}, "en": "xyz"}, context) // =>  {'*': "{image_carousel()}"}
     * context.getAll("error")[0].message // => "The only keys allowed next to a 'special'-block are 'before' and 'after'. Perhaps you meant to put 'en' into the special block?"
     *
     * // should give an error on unknown visualisations
     * const context = ConversionContext.test()
     * RewriteSpecial.convertIfNeeded({"special": {type: "qsdf"}}, context) // => undefined
     * context.getAll("error")[0].message.indexOf("Special visualisation 'qsdf' not found") >= 0 // => true
     *
     * // should give an error is 'type' is missing
     * const context = ConversionContext.test()
     * RewriteSpecial.convertIfNeeded({"special": {}}, context) // => undefined
     * context.getAll("error")[0].message // => "A 'special'-block should define 'type' to indicate which visualisation should be used"
     *
     *
     * // an actual test
     * const special = {
     *     "before": {
     *             "en": "<h3>Entrances</h3>This building has {_entrances_count} entrances:"
     *           },
     *     "after": {
     *             "en": "{_entrances_count_without_width_count} entrances don't have width information yet"
     *           },
     *     "special": {
     *           "type": "multi",
     *           "key": "_entrance_properties_with_width",
     *           "tagrendering": {
     *             "en": "An <a href='#{id}'>entrance</a> of {canonical(width)}"
     *           }
     *         }}
     * const context = ConversionContext.test()
     * RewriteSpecial.convertIfNeeded(special, context) // => {"en": "<h3>Entrances</h3>This building has {_entrances_count} entrances:{multi(_entrance_properties_with_width,An <a href='#&LBRACEid&RBRACE'>entrance</a> of &LBRACEcanonical&LPARENSwidth&RPARENS&RBRACE)}{_entrances_count_without_width_count} entrances don't have width information yet"}
     * context.getAll("error") // => []
     */
    private static convertIfNeeded(
        input:
            | (object & {
                  special: {
                      type: string
                  }
              })
            | any,
        context: ConversionContext
    ): any {
        const special = input["special"]
        if (special === undefined) {
            return input
        }

        const type = special["type"]
        if (type === undefined) {
            context.err(
                "A 'special'-block should define 'type' to indicate which visualisation should be used"
            )
            return undefined
        }

        const vis = SpecialVisualizations.specialVisualizations.find((sp) => sp.funcName === type)
        if (vis === undefined) {
            const options = Utils.sortedByLevenshteinDistance(
                type,
                SpecialVisualizations.specialVisualizations,
                (sp) => sp.funcName
            )
            context.err(
                `Special visualisation '${type}' not found. Did you perhaps mean ${options[0].funcName}, ${options[1].funcName} or ${options[2].funcName}?\n\tFor all known special visualisations, please see https://github.com/pietervdvn/MapComplete/blob/develop/Docs/SpecialRenderings.md`
            )
            return undefined
        }
        Array.from(Object.keys(input))
            .filter((k) => k !== "special" && k !== "before" && k !== "after")
            .map((k) => {
                return `The only keys allowed next to a 'special'-block are 'before' and 'after'. Perhaps you meant to put '${k}' into the special block?`
            })
            .forEach((e) => context.err(e))

        const argNamesList = vis.args.map((a) => a.name)
        const argNames = new Set<string>(argNamesList)
        // Check for obsolete and misspelled arguments
        Object.keys(special)
            .filter((k) => !argNames.has(k))
            .filter((k) => k !== "type" && k !== "before" && k !== "after")
            .map((wrongArg) => {
                const byDistance = Utils.sortedByLevenshteinDistance(
                    wrongArg,
                    argNamesList,
                    (x) => x
                )
                return `Unexpected argument in special block at ${context} with name '${wrongArg}'. Did you mean ${
                    byDistance[0]
                }?\n\tAll known arguments are ${argNamesList.join(", ")}`
            })
            .forEach((e) => context.err(e))

        // Check that all obligated arguments are present. They are obligated if they don't have a preset value
        for (const arg of vis.args) {
            if (arg.required !== true) {
                continue
            }
            const param = special[arg.name]
            if (param === undefined) {
                context.err(
                    `Obligated parameter '${arg.name}' in special rendering of type ${
                        vis.funcName
                    } not found.\n    The full special rendering specification is: '${JSON.stringify(
                        input
                    )}'\n    ${arg.name}: ${arg.doc}`
                )
            }
        }

        const foundLanguages = new Set<string>()
        const translatedArgs = argNamesList
            .map((nm) => special[nm])
            .filter((v) => v !== undefined)
            .filter((v) => Translations.isProbablyATranslation(v))
        for (const translatedArg of translatedArgs) {
            for (const ln of Object.keys(translatedArg)) {
                foundLanguages.add(ln)
            }
        }

        const before = Translations.T(input.before)
        const after = Translations.T(input.after)

        for (const ln of Object.keys(before?.translations ?? {})) {
            foundLanguages.add(ln)
        }
        for (const ln of Object.keys(after?.translations ?? {})) {
            foundLanguages.add(ln)
        }

        if (foundLanguages.size === 0) {
            const args = argNamesList.map((nm) => special[nm] ?? "").join(",")
            return {
                "*": `{${type}(${args})}`,
            }
        }

        const result = {}
        const languages = Array.from(foundLanguages)
        languages.sort()
        for (const ln of languages) {
            const args = []
            for (const argName of argNamesList) {
                let v = special[argName] ?? ""
                if (Translations.isProbablyATranslation(v)) {
                    v = new Translation(v).textFor(ln)
                }

                if (typeof v === "string") {
                    const txt = v
                        .replace(/,/g, "&COMMA")
                        .replace(/\{/g, "&LBRACE")
                        .replace(/}/g, "&RBRACE")
                        .replace(/\(/g, "&LPARENS")
                        .replace(/\)/g, "&RPARENS")
                    args.push(txt)
                } else if (typeof v === "object") {
                    args.push(JSON.stringify(v))
                } else {
                    args.push(v)
                }
            }
            const beforeText = before?.textFor(ln) ?? ""
            const afterText = after?.textFor(ln) ?? ""
            result[ln] = `${beforeText}{${type}(${args.map((a) => a).join(",")})}${afterText}`
        }
        return result
    }

    /**
     * const tr = {
     *     render: {special: {type: "image_carousel", image_key: "image" }},
     *     mappings: [
     *         {
     *             if: "other_image_key",
     *             then: {special: {type: "image_carousel", image_key: "other_image_key"}}
     *         }
     *     ]
     * }
     * const result = new RewriteSpecial().convertStrict(tr,ConversionContext.test())
     * const expected = {render:  {'*': "{image_carousel(image)}"}, mappings: [{if: "other_image_key", then:  {'*': "{image_carousel(other_image_key)}"}} ]}
     * result // => expected
     *
     * // Should put text before if specified
     * const tr = {
     *     render: {special: {type: "image_carousel", image_key: "image"}, before: {en: "Some introduction"} },
     * }
     * const result = new RewriteSpecial().convertStrict(tr,ConversionContext.test())
     * const expected = {render:  {'en': "Some introduction{image_carousel(image)}"}}
     * result // => expected
     *
     * // Should put text after if specified
     * const tr = {
     *     render: {special: {type: "image_carousel", image_key: "image"}, after: {en: "Some footer"} },
     * }
     * const result = new RewriteSpecial().convertStrict(tr,ConversionContext.test())
     * const expected = {render:  {'en': "{image_carousel(image)}Some footer"}}
     * result // => expected
     */
    convert(json: TagRenderingConfigJson, context: ConversionContext): TagRenderingConfigJson {
        json = Utils.Clone(json)
        const paths: ConfigMeta[] = tagrenderingconfigmeta
        for (const path of paths) {
            if (path.hints.typehint !== "rendered") {
                continue
            }
            Utils.WalkPath(path.path, json, (leaf, travelled) =>
                RewriteSpecial.convertIfNeeded(leaf, context.enter(travelled))
            )
        }

        return json
    }
}

class ExpandIconBadges extends DesugaringStep<PointRenderingConfigJson> {
    private _expand: ExpandTagRendering

    constructor(state: DesugaringContext, layer: LayerConfigJson) {
        super("Expands shorthand properties on iconBadges", ["iconBadges"], "ExpandIconBadges")
        this._expand = new ExpandTagRendering(state, layer)
    }

    convert(json: PointRenderingConfigJson, context: ConversionContext): PointRenderingConfigJson {
        if (!json["iconBadges"]) {
            return json
        }
        const badgesJson = json.iconBadges

        const iconBadges: {
            if: TagConfigJson
            then: string | MinimalTagRenderingConfigJson
        }[] = []

        for (let i = 0; i < badgesJson.length; i++) {
            const iconBadge: {
                if: TagConfigJson
                then: string | MinimalTagRenderingConfigJson
            } = badgesJson[i]
            const expanded = this._expand.convert(
                <QuestionableTagRenderingConfigJson>iconBadge.then,
                context.enters("iconBadges", i)
            )
            if (expanded === undefined) {
                iconBadges.push(iconBadge)
                continue
            }

            iconBadges.push(
                ...expanded.map((resolved) => ({
                    if: iconBadge.if,
                    then: <MinimalTagRenderingConfigJson>resolved,
                }))
            )
        }

        return { ...json, iconBadges }
    }
}

class PreparePointRendering extends Fuse<PointRenderingConfigJson> {
    constructor(state: DesugaringContext, layer: LayerConfigJson) {
        super(
            "Prepares point renderings by expanding 'icon' and 'iconBadges'",
            new On(
                "marker",
                new Each(
                    new On(
                        "icon",
                        new FirstOf(new ExpandTagRendering(state, layer, { applyCondition: false }))
                    )
                )
            ),
            new ExpandIconBadges(state, layer)
        )
    }
}

class SetFullNodeDatabase extends DesugaringStep<LayerConfigJson> {
    constructor() {
        super(
            "sets the fullNodeDatabase-bit if needed",
            ["fullNodeDatabase"],
            "SetFullNodeDatabase"
        )
    }

    convert(json: LayerConfigJson, context: ConversionContext): LayerConfigJson {
        const needsSpecial =
            json.tagRenderings?.some((tr) => {
                if (typeof tr === "string") {
                    return false
                }
                const specs = ValidationUtils.getSpecialVisualisations(<TagRenderingConfigJson>tr)
                return specs?.some((sp) => sp.needsNodeDatabase)
            }) ?? false
        if (!needsSpecial) {
            return json
        }
        context.info("Layer " + json.id + " needs the fullNodeDatabase")
        return { ...json, fullNodeDatabase: true }
    }
}

export class AddMiniMap extends DesugaringStep<LayerConfigJson> {
    private readonly _state: DesugaringContext

    constructor(state: DesugaringContext) {
        super(
            "Adds a default 'minimap'-element to the tagrenderings if none of the elements define such a minimap",
            ["tagRenderings"],
            "AddMiniMap"
        )
        this._state = state
    }

    convert(layerConfig: LayerConfigJson, context: ConversionContext): LayerConfigJson {
        if (!layerConfig.tagRenderings || layerConfig.source === "special") {
            return layerConfig
        }
        const state = this._state
        const hasMinimap = ValidationUtils.hasSpecialVisualisation(layerConfig, "minimap")
        if (!hasMinimap) {
            layerConfig = { ...layerConfig }
            layerConfig.tagRenderings = [...layerConfig.tagRenderings]
            const minimap = state.tagRenderings.get("minimap")
            if (minimap === undefined) {
                if (state.tagRenderings.size > 0) {
                    throw "The 'minimap'-builtin tagrendering is not defined. As such, it cannot be added automatically"
                }
            } else {
                layerConfig.tagRenderings.push(minimap)
            }
        }

        return layerConfig
    }
}

class ExpandMarkerRenderings extends DesugaringStep<IconConfigJson> {
    private readonly _layer: LayerConfigJson
    private readonly _state: DesugaringContext

    constructor(state: DesugaringContext, layer: LayerConfigJson) {
        super(
            "Expands tagRenderings in the icons, if needed",
            ["icon", "color"],
            "ExpandMarkerRenderings"
        )
        this._layer = layer
        this._state = state
    }

    convert(json: IconConfigJson, context: ConversionContext): IconConfigJson {
        const expander = new ExpandTagRendering(this._state, this._layer)
        const result: IconConfigJson = { icon: undefined, color: undefined }
        if (json.icon && json.icon["builtin"]) {
            result.icon = <MinimalTagRenderingConfigJson>(
                expander.convert(<any>json.icon, context.enter("icon"))[0]
            )
        } else {
            result.icon = json.icon
        }
        if (json.color && json.color["builtin"]) {
            result.color = <MinimalTagRenderingConfigJson>(
                expander.convert(<any>json.color, context.enter("color"))[0]
            )
        } else {
            result.color = json.color
        }
        return result
    }
}

export class PrepareLayer extends Fuse<LayerConfigJson> {
    constructor(state: DesugaringContext) {
        super(
            "Fully prepares and expands a layer for the LayerConfig.",
            new On("tagRenderings", new Each(new RewriteSpecial())),
            new On("tagRenderings", new Concat(new ExpandRewrite()).andThenF(Utils.Flatten)),
            new On("tagRenderings", (layer) => new Concat(new ExpandTagRendering(state, layer))),
            new On("tagRenderings", new Each(new DetectInline())),
            new AddQuestionBox(),
            new AddMiniMap(state),
            new AddEditingElements(state),
            new SetFullNodeDatabase(),
            new On<
                (LineRenderingConfigJson | RewritableConfigJson<LineRenderingConfigJson>)[],
                LayerConfigJson
            >("lineRendering", new Each(new ExpandRewrite()).andThenF(Utils.Flatten)),
            new On<PointRenderingConfigJson[], LayerConfigJson>(
                "pointRendering",
                (layer) =>
                    new Each(new On("marker", new Each(new ExpandMarkerRenderings(state, layer))))
            ),
            new On<PointRenderingConfigJson[], LayerConfigJson>(
                "pointRendering",
                (layer) => new Each(new PreparePointRendering(state, layer))
            ),
            new SetDefault("titleIcons", ["icons.defaults"]),
            new On(
                "titleIcons",
                (layer) =>
                    new Concat(new ExpandTagRendering(state, layer, { noHardcodedStrings: true }))
            ),
            new ExpandFilter(state)
        )
    }
}
