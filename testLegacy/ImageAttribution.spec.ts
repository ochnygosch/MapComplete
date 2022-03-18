import {equal} from "assert";
import T from "./TestHelper";
import {Translation} from "../UI/i18n/Translation";
import * as cyclofix from "../assets/generated/themes/cyclofix.json"
import {ExtractImages} from "../Models/ThemeConfig/Conversion/FixImages";

export default class ImageAttributionSpec extends T {
    constructor() {
        super([
            [
                "Should find all the images",
                () => {
                    const images = new Set(new ExtractImages(true, new Map<string, any>()).convertStrict(<any> cyclofix, "test"))
                    const expectedValues = [
                        './assets/layers/bike_repair_station/repair_station.svg',
                        './assets/layers/bike_repair_station/repair_station_pump.svg',
                        './assets/layers/bike_repair_station/broken_pump.svg',
                        './assets/layers/bike_repair_station/pump.svg',
                        './assets/themes/cyclofix/fietsambassade_gent_logo_small.svg',
                        './assets/layers/bike_repair_station/pump_example_manual.jpg',
                        './assets/layers/bike_repair_station/pump_example.png',
                        './assets/layers/bike_repair_station/pump_example_round.jpg',
                        './assets/layers/bike_repair_station/repair_station_example_2.jpg',
                        'close']
                    for (const expected of expectedValues) {
                        T.isTrue(images.has(expected), expected + " not found")
                    }
                }
            ],
            [
                "Test image discovery regex",
                () => {
                    const tr = new Translation({en: "XYZ <img src='a.svg'/> XYZ <img src=\"some image.svg\"></img> XYZ <img src=b.svg/>"})
                    const images = new Set<string>(tr.ExtractImages(false));
                    equal(3, images.size)
                    T.isTrue(images.has("a.svg"), "a.svg not found")
                    T.isTrue(images.has("b.svg"), "b.svg not found")
                    T.isTrue(images.has("some image.svg"), "some image.svg not found")

                }
            ]

        ]);
    }
}