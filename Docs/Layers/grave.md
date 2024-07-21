[//]: # (WARNING: this file is automatically generated. Please find the sources at the bottom and edit those sources)

# grave




Tombstones (and graves) indicate where a person was buried. On this map, those can be recorded and a link to Wikipedia can be made






 - This layer is shown at zoomlevel **15** and higher



## Table of contents

1. [Themes using this layer](#themes-using-this-layer)
2. [Basic tags for this layer](#basic-tags-for-this-layer)
3. [Supported attributes](#supported-attributes)
  - [images](#images)
  - [buried:wikidata](#buriedwikidata)
  - [name](#name)
  - [leftover-questions](#leftover-questions)
  - [lod](#lod)
4. [Filters](#filters)

## Themes using this layer



 - [memorials](https://mapcomplete.org/memorials)
 - [personal](https://mapcomplete.org/personal)



## Basic tags for this layer

Elements must match the expression **<a href='https://wiki.openstreetmap.org/wiki/Key:historic' target='_blank'>historic</a>=<a href='https://wiki.openstreetmap.org/wiki/Tag:historic%3Dtomb' target='_blank'>tomb</a>**

[Execute on overpass](http://overpass-turbo.eu/?Q=%5Bout%3Ajson%5D%5Btimeout%3A90%5D%3B%28%20%20%20%20nwr%5B%22historic%22%3D%22tomb%22%5D%28%7B%7Bbbox%7D%7D%29%3B%0A%29%3Bout%20body%3B%3E%3Bout%20skel%20qt%3B)

## Supported attributes

**Warning:**,this quick overview is incomplete,

| attribute | type | values which are supported by this layer |
-----|-----|----- |
| <a target="_blank" href='https://taginfo.openstreetmap.org/keys/buried:wikidata#values'><img src='https://mapcomplete.org/assets/svg/search.svg' height='18px'></a> <a target="_blank" href='https://taghistory.raifer.tech/?#***/buried%3Awikidata/'><img src='https://mapcomplete.org/assets/svg/statistics.svg' height='18px'></a> [buried:wikidata](https://wiki.openstreetmap.org/wiki/Key:buried:wikidata) | [wikidata](../SpecialInputElements.md#wikidata) |  |
| <a target="_blank" href='https://taginfo.openstreetmap.org/keys/name#values'><img src='https://mapcomplete.org/assets/svg/search.svg' height='18px'></a> <a target="_blank" href='https://taghistory.raifer.tech/?#***/name/'><img src='https://mapcomplete.org/assets/svg/statistics.svg' height='18px'></a> [name](https://wiki.openstreetmap.org/wiki/Key:name) | [string](../SpecialInputElements.md#string) |  |




### images
This block shows the known images which are linked with the `image`-keys, but also via `mapillary` and `wikidata` and shows the button to upload new images
_This tagrendering has no question and is thus read-only_
*{image_carousel()}{image_upload()}*




### buried:wikidata

The question is `What is the Wikipedia page of the person buried here?`
*{wikipedia(buried:wikidata)}* is shown if `buried:wikidata` is set




### name

The question is `What is the name of the person buried here?`
*<b>{name}</b> is buried here* is shown if `name` is set




### leftover-questions

_This tagrendering has no question and is thus read-only_
*{questions( ,)}*




### lod

_This tagrendering has no question and is thus read-only_
*{linked_data_from_website()}*


This tagrendering has labels 
`added_by_default`

## Filters



| id | question | osmTags |
-----|-----|----- |
| has_wikidata.0 | *With or without wikidata* (default) |  |
| has_wikidata.1 | Has a link to Wikidata | buried:wikidata~.+ |
| has_wikidata.2 | Has no link to Wikidata | buried:wikidata= |




This document is autogenerated from [assets/layers/grave/grave.json](https://github.com/pietervdvn/MapComplete/blob/develop/assets/layers/grave/grave.json)