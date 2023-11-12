import { ConversionMessage, ConversionMsgLevel } from "./Conversion"

export class ConversionContext {
    /**
     *  The path within the data structure where we are currently operating
     */
    readonly path: ReadonlyArray<string | number>
    /**
     * Some information about the current operation
     */
    readonly operation: ReadonlyArray<string>
    readonly messages: ConversionMessage[]

    private _hasErrors: boolean = false

    private constructor(
        messages: ConversionMessage[],
        path: ReadonlyArray<string | number>,
        operation?: ReadonlyArray<string>
    ) {
        this.path = path
        this.operation = operation ?? []
        // Messages is shared by reference amonst all 'context'-objects for performance
        this.messages = messages
        if (this.path.some((p) => typeof p === "object" || p === "[object Object]")) {
            throw "ConversionMessage: got an object as path entry:" + JSON.stringify(path)
        }
    }

    public static construct(path: (string | number)[], operation: string[]) {
        return new ConversionContext([], [...path], [...operation])
    }

    public static test(msg?: string) {
        return new ConversionContext([], msg ? [msg] : [], ["test"])
    }

    static print(msg: ConversionMessage) {
        const noString = msg.context.path.filter(
            (p) => typeof p !== "string" && typeof p !== "number"
        )
        if (noString.length > 0) {
            console.warn("Non-string value in path:", ...noString)
        }
        if (msg.level === "error") {
            console.error(
                ConversionContext.red("ERR "),
                msg.context.path.join("."),
                ConversionContext.red(msg.message),
                msg.context.operation.join(".")
            )
        } else if (msg.level === "warning") {
            console.warn(
                ConversionContext.red("<!> "),
                msg.context.path.join("."),
                ConversionContext.yellow(msg.message),
                msg.context.operation.join(".")
            )
        } else {
            console.log("    ", msg.context.path.join("."), msg.message)
        }
    }

    private static yellow(s) {
        return "\x1b[33m" + s + "\x1b[0m"
    }

    private static red(s) {
        return "\x1b[31m" + s + "\x1b[0m"
    }

    public enter(key: string | number | (string | number)[]) {
        if (!Array.isArray(key)) {
            return new ConversionContext(this.messages, [...this.path, key], this.operation)
        }
        return new ConversionContext(this.messages, [...this.path, ...key], this.operation)
    }

    public enters(...key: (string | number)[]) {
        return this.enter(key)
    }

    public inOperation(key: string) {
        return new ConversionContext(this.messages, this.path, [...this.operation, key])
    }

    warn(message: string) {
        this.messages.push({ context: this, level: "warning", message })
    }

    err(message: string) {
        this._hasErrors = true
        this.messages.push({ context: this, level: "error", message })
    }

    info(message: string) {
        this.messages.push({ context: this, level: "information", message })
    }

    getAll(mode: ConversionMsgLevel): ConversionMessage[] {
        return this.messages.filter((m) => m.level === mode)
    }

    public hasErrors() {
        if (this._hasErrors) {
            return true
        }
        const foundErr = this.messages?.find((m) => m.level === "error") !== undefined
        this._hasErrors = foundErr
        return foundErr
    }

    debug(message: string) {
        this.messages.push({ context: this, level: "debug", message })
    }
}