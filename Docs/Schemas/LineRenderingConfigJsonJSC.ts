export default {
  "description": "The LineRenderingConfig gives all details onto how to render a single line of a feature.\n\nThis can be used if:\n\n- The feature is a line\n- The feature is an area",
  "type": "object",
  "properties": {
    "color": {
      "description": "The color for way-elements and SVG-elements.\nIf the value starts with \"--\", the style of the body element will be queried for the corresponding variable instead",
      "anyOf": [
        {
          "$ref": "#/definitions/TagRenderingConfigJson"
        },
        {
          "type": "string"
        }
      ]
    },
    "width": {
      "description": "The stroke-width for way-elements",
      "anyOf": [
        {
          "$ref": "#/definitions/TagRenderingConfigJson"
        },
        {
          "type": [
            "string",
            "number"
          ]
        }
      ]
    },
    "dashArray": {
      "description": "A dasharray, e.g. \"5 6\"\nThe dasharray defines 'pixels of line, pixels of gap, pixels of line, pixels of gap',\nDefault value: \"\" (empty string == full line)",
      "anyOf": [
        {
          "$ref": "#/definitions/TagRenderingConfigJson"
        },
        {
          "type": "string"
        }
      ]
    },
    "lineCap": {
      "description": "The form at the end of a line",
      "anyOf": [
        {
          "$ref": "#/definitions/TagRenderingConfigJson"
        },
        {
          "type": "string"
        }
      ]
    },
    "fill": {
      "description": "Wehter or not to fill polygons",
      "anyOf": [
        {
          "$ref": "#/definitions/TagRenderingConfigJson"
        },
        {
          "enum": [
            "no",
            "yes"
          ],
          "type": "string"
        }
      ]
    },
    "fillColor": {
      "description": "The color to fill a polygon with.\nIf undefined, this will be slightly more opaque version of the stroke line",
      "anyOf": [
        {
          "$ref": "#/definitions/TagRenderingConfigJson"
        },
        {
          "type": "string"
        }
      ]
    },
    "offset": {
      "description": "The number of pixels this line should be moved.\nUse a positive numbe to move to the right, a negative to move to the left (left/right as defined by the drawing direction of the line).\n\nIMPORTANT: MapComplete will already normalize 'key:both:property' and 'key:both' into the corresponding 'key:left' and 'key:right' tagging (same for 'sidewalk=left/right/both' which is rewritten to 'sidewalk:left' and 'sidewalk:right')\nThis simplifies programming. Refer to the CalculatedTags.md-documentation for more details",
      "anyOf": [
        {
          "$ref": "#/definitions/TagRenderingConfigJson"
        },
        {
          "type": "number"
        }
      ]
    }
  },
  "definitions": {
    "AndOrTagConfigJson": {
      "type": "object",
      "properties": {
        "and": {
          "type": "array",
          "items": {
            "anyOf": [
              {
                "$ref": "#/definitions/AndOrTagConfigJson"
              },
              {
                "type": "string"
              }
            ]
          }
        },
        "or": {
          "type": "array",
          "items": {
            "anyOf": [
              {
                "$ref": "#/definitions/AndOrTagConfigJson"
              },
              {
                "type": "string"
              }
            ]
          }
        }
      }
    },
    "ApplicableUnitJson": {
      "type": "object",
      "properties": {
        "canonicalDenomination": {
          "description": "The canonical value which will be added to the text.\ne.g. \"m\" for meters\nIf the user inputs '42', the canonical value will be added and it'll become '42m'",
          "type": "string"
        },
        "canonicalDenominationSingular": {
          "description": "The canonical denomination in the case that the unit is precisely '1'",
          "type": "string"
        },
        "alternativeDenomination": {
          "description": "A list of alternative values which can occur in the OSM database - used for parsing.",
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "human": {
          "description": "The value for humans in the dropdown. This should not use abbreviations and should be translated, e.g.\n{\n    \"en\": \"meter\",\n    \"fr\": \"metre\"\n}"
        },
        "humanSingular": {
          "description": "The value for humans in the dropdown. This should not use abbreviations and should be translated, e.g.\n{\n    \"en\": \"minute\",\n    \"nl\": \"minuut\"x²\n}"
        },
        "prefix": {
          "description": "If set, then the canonical value will be prefixed instead, e.g. for '€'\nNote that if all values use 'prefix', the dropdown might move to before the text field",
          "type": "boolean"
        },
        "default": {
          "description": "The default interpretation - only one can be set.\nIf none is set, the first unit will be considered the default interpretation of a value without a unit",
          "type": "boolean"
        }
      },
      "required": [
        "canonicalDenomination"
      ]
    },
    "TagRenderingConfigJson": {
      "description": "A TagRenderingConfigJson is a single piece of code which converts one ore more tags into a HTML-snippet.\nFor an _editable_ tagRenerdering, use 'QuestionableTagRenderingConfigJson' instead, which extends this one",
      "type": "object",
      "properties": {
        "id": {
          "description": "The id of the tagrendering, should be an unique string.\nUsed to keep the translations in sync. Only used in the tagRenderings-array of a layerConfig, not requered otherwise.\n\nUse 'questions' to trigger the question box of this group (if a group is defined)",
          "type": "string"
        },
        "group": {
          "description": "If 'group' is defined on many tagRenderings, these are grouped together when shown. The questions are grouped together as well.\nThe first tagRendering of a group will always be a sticky element.",
          "type": "string"
        },
        "labels": {
          "description": "A list of labels. These are strings that are used for various purposes, e.g. to filter them away",
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "render": {
          "description": "Renders this value. Note that \"{key}\"-parts are substituted by the corresponding values of the element.\nIf neither 'textFieldQuestion' nor 'mappings' are defined, this text is simply shown as default value.\n\nNote that this is a HTML-interpreted value, so you can add links as e.g. '<a href='{website}'>{website}</a>' or include images such as `This is of type A <br><img src='typeA-icon.svg' />`\ntype: rendered"
        },
        "condition": {
          "description": "Only show this tagrendering (or question) if the object also matches the following tags.\n\nThis is useful to ask a follow-up question. E.g. if there is a diaper table, then ask a follow-up question on diaper tables...",
          "anyOf": [
            {
              "$ref": "#/definitions/AndOrTagConfigJson"
            },
            {
              "type": "string"
            }
          ]
        },
        "freeform": {
          "description": "Allow freeform text input from the user",
          "type": "object",
          "properties": {
            "key": {
              "description": "If this key is present, then 'render' is used to display the value.\nIf this is undefined, the rendering is _always_ shown",
              "type": "string"
            }
          },
          "required": [
            "key"
          ]
        },
        "mappings": {
          "description": "Allows fixed-tag inputs, shown either as radiobuttons or as checkboxes",
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "if": {
                "description": "If this condition is met, then the text under `then` will be shown.\nIf no value matches, and the user selects this mapping as an option, then these tags will be uploaded to OSM.\n\nFor example: {'if': 'diet:vegetarion=yes', 'then':'A vegetarian option is offered here'}\n\nThis can be an substituting-tag as well, e.g. {'if': 'addr:street:={_calculated_nearby_streetname}', 'then': '{_calculated_nearby_streetname}'}",
                "anyOf": [
                  {
                    "$ref": "#/definitions/AndOrTagConfigJson"
                  },
                  {
                    "type": "string"
                  }
                ]
              },
              "then": {
                "description": "If the condition `if` is met, the text `then` will be rendered.\nIf not known yet, the user will be presented with `then` as an option\nType: rendered"
              },
              "icon": {
                "description": "An icon supporting this mapping; typically shown pretty small\nType: icon",
                "anyOf": [
                  {
                    "type": "object",
                    "properties": {
                      "path": {
                        "description": "The path to the icon\nType: icon",
                        "type": "string"
                      },
                      "class": {
                        "description": "A hint to mapcomplete on how to render this icon within the mapping.\nThis is translated to 'mapping-icon-<classtype>', so defining your own in combination with a custom CSS is possible (but discouraged)",
                        "type": "string"
                      }
                    },
                    "required": [
                      "class",
                      "path"
                    ]
                  },
                  {
                    "type": "string"
                  }
                ]
              }
            },
            "required": [
              "if",
              "then"
            ]
          }
        }
      }
    }
  },
  "$schema": "http://json-schema.org/draft-07/schema#"
}