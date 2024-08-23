[//]: # (WARNING: this file is automatically generated. Please find the sources at the bottom and edit those sources)

# artwork_on_wall


This layer is based on [artwork](../Layers/artwork.md)

An open map of statues, busts, graffitis and other artwork all over the world






 - This layer is shown at zoomlevel **16** and higher



## Table of contents

1. [Themes using this layer](#themes-using-this-layer)
2. [Basic tags for this layer](#basic-tags-for-this-layer)
3. [Supported attributes](#supported-attributes)
  - [historic_or_not](#historic_or_not)
  - [images](#images)
  - [artwork-artwork_type](#artwork-artwork_type)
  - [artwork-artist-wikidata](#artwork-artist-wikidata)
  - [artwork-artist_name](#artwork-artist_name)
  - [artwork-website](#artwork-website)
  - [wikipedia](#wikipedia)
  - [artwork_subject](#artwork_subject)
  - [doubles_as_memorial](#doubles_as_memorial)
  - [doubles_as_bench](#doubles_as_bench)
  - [leftover-questions](#leftover-questions)
  - [move-button](#move-button)
  - [delete-button](#delete-button)
  - [lod](#lod)
4. [Filters](#filters)

## Themes using this layer



 - [ghostsigns](https://mapcomplete.org/ghostsigns)



## Basic tags for this layer

Elements must match **all** of the following expressions:

0. <a href='https://wiki.openstreetmap.org/wiki/Key:tourism' target='_blank'>tourism</a>=<a href='https://wiki.openstreetmap.org/wiki/Tag:tourism%3Dartwork' target='_blank'>artwork</a>
1. <a href='https://wiki.openstreetmap.org/wiki/Key:artwork_type' target='_blank'>artwork_type</a>=<a href='https://wiki.openstreetmap.org/wiki/Tag:artwork_type%3Dmural' target='_blank'>mural</a> | <a href='https://wiki.openstreetmap.org/wiki/Key:artwork_type' target='_blank'>artwork_type</a>=<a href='https://wiki.openstreetmap.org/wiki/Tag:artwork_type%3Dgraffiti' target='_blank'>graffiti</a> | <a href='https://wiki.openstreetmap.org/wiki/Key:artwork_type' target='_blank'>artwork_type</a>=<a href='https://wiki.openstreetmap.org/wiki/Tag:artwork_type%3Dmosaic' target='_blank'>mosaic</a> | <a href='https://wiki.openstreetmap.org/wiki/Key:artwork_type' target='_blank'>artwork_type</a>=<a href='https://wiki.openstreetmap.org/wiki/Tag:artwork_type%3Drelief' target='_blank'>relief</a> | <a href='https://wiki.openstreetmap.org/wiki/Key:artwork_type' target='_blank'>artwork_type</a>=<a href='https://wiki.openstreetmap.org/wiki/Tag:artwork_type%3Dpainting' target='_blank'>painting</a> | <a href='https://wiki.openstreetmap.org/wiki/Key:artwork_type' target='_blank'>artwork_type</a>=<a href='https://wiki.openstreetmap.org/wiki/Tag:artwork_type%3Dmural_painting' target='_blank'>mural_painting</a>

[Execute on overpass](http://overpass-turbo.eu/?Q=%5Bout%3Ajson%5D%5Btimeout%3A90%5D%3B%28%20%20%20%20nwr%5B%22tourism%22%3D%22artwork%22%5D%5B%22artwork_type%22%3D%22mural%22%5D%28%7B%7Bbbox%7D%7D%29%3B%0A%20%20%20%20nwr%5B%22tourism%22%3D%22artwork%22%5D%5B%22artwork_type%22%3D%22graffiti%22%5D%28%7B%7Bbbox%7D%7D%29%3B%0A%20%20%20%20nwr%5B%22tourism%22%3D%22artwork%22%5D%5B%22artwork_type%22%3D%22mosaic%22%5D%28%7B%7Bbbox%7D%7D%29%3B%0A%20%20%20%20nwr%5B%22tourism%22%3D%22artwork%22%5D%5B%22artwork_type%22%3D%22relief%22%5D%28%7B%7Bbbox%7D%7D%29%3B%0A%20%20%20%20nwr%5B%22tourism%22%3D%22artwork%22%5D%5B%22artwork_type%22%3D%22painting%22%5D%28%7B%7Bbbox%7D%7D%29%3B%0A%20%20%20%20nwr%5B%22tourism%22%3D%22artwork%22%5D%5B%22artwork_type%22%3D%22mural_painting%22%5D%28%7B%7Bbbox%7D%7D%29%3B%0A%29%3Bout%20body%3B%3E%3Bout%20skel%20qt%3B)

## Supported attributes

**Warning:**,this quick overview is incomplete,

| attribute | type | values which are supported by this layer |
-----|-----|----- |
| <a target="_blank" href='https://taginfo.openstreetmap.org/keys/historic#values'><img src='https://mapcomplete.org/assets/svg/search.svg' height='18px'></a> <a target="_blank" href='https://taghistory.raifer.tech/?#***/historic/'><img src='https://mapcomplete.org/assets/svg/statistics.svg' height='18px'></a> [historic](https://wiki.openstreetmap.org/wiki/Key:historic) | Multiple choice | [advertising](https://wiki.openstreetmap.org/wiki/Tag:historic%3Dadvertising) [](https://wiki.openstreetmap.org/wiki/Tag:historic%3D) |
| <a target="_blank" href='https://taginfo.openstreetmap.org/keys/artwork_type#values'><img src='https://mapcomplete.org/assets/svg/search.svg' height='18px'></a> <a target="_blank" href='https://taghistory.raifer.tech/?#***/artwork_type/'><img src='https://mapcomplete.org/assets/svg/statistics.svg' height='18px'></a> [artwork_type](https://wiki.openstreetmap.org/wiki/Key:artwork_type) | [string](../SpecialInputElements.md#string) | [architecture](https://wiki.openstreetmap.org/wiki/Tag:artwork_type%3Darchitecture) [mural](https://wiki.openstreetmap.org/wiki/Tag:artwork_type%3Dmural) [painting](https://wiki.openstreetmap.org/wiki/Tag:artwork_type%3Dpainting) [sculpture](https://wiki.openstreetmap.org/wiki/Tag:artwork_type%3Dsculpture) [statue](https://wiki.openstreetmap.org/wiki/Tag:artwork_type%3Dstatue) [bust](https://wiki.openstreetmap.org/wiki/Tag:artwork_type%3Dbust) [stone](https://wiki.openstreetmap.org/wiki/Tag:artwork_type%3Dstone) [installation](https://wiki.openstreetmap.org/wiki/Tag:artwork_type%3Dinstallation) [graffiti](https://wiki.openstreetmap.org/wiki/Tag:artwork_type%3Dgraffiti) [relief](https://wiki.openstreetmap.org/wiki/Tag:artwork_type%3Drelief) [azulejo](https://wiki.openstreetmap.org/wiki/Tag:artwork_type%3Dazulejo) [tilework](https://wiki.openstreetmap.org/wiki/Tag:artwork_type%3Dtilework) [woodcarving](https://wiki.openstreetmap.org/wiki/Tag:artwork_type%3Dwoodcarving) |
| <a target="_blank" href='https://taginfo.openstreetmap.org/keys/artist:wikidata#values'><img src='https://mapcomplete.org/assets/svg/search.svg' height='18px'></a> <a target="_blank" href='https://taghistory.raifer.tech/?#***/artist%3Awikidata/'><img src='https://mapcomplete.org/assets/svg/statistics.svg' height='18px'></a> [artist:wikidata](https://wiki.openstreetmap.org/wiki/Key:artist:wikidata) | [wikidata](../SpecialInputElements.md#wikidata) |  |
| <a target="_blank" href='https://taginfo.openstreetmap.org/keys/artist_name#values'><img src='https://mapcomplete.org/assets/svg/search.svg' height='18px'></a> <a target="_blank" href='https://taghistory.raifer.tech/?#***/artist_name/'><img src='https://mapcomplete.org/assets/svg/statistics.svg' height='18px'></a> [artist_name](https://wiki.openstreetmap.org/wiki/Key:artist_name) | [string](../SpecialInputElements.md#string) |  |
| <a target="_blank" href='https://taginfo.openstreetmap.org/keys/website#values'><img src='https://mapcomplete.org/assets/svg/search.svg' height='18px'></a> <a target="_blank" href='https://taghistory.raifer.tech/?#***/website/'><img src='https://mapcomplete.org/assets/svg/statistics.svg' height='18px'></a> [website](https://wiki.openstreetmap.org/wiki/Key:website) | [url](../SpecialInputElements.md#url) |  |
| <a target="_blank" href='https://taginfo.openstreetmap.org/keys/wikidata#values'><img src='https://mapcomplete.org/assets/svg/search.svg' height='18px'></a> <a target="_blank" href='https://taghistory.raifer.tech/?#***/wikidata/'><img src='https://mapcomplete.org/assets/svg/statistics.svg' height='18px'></a> [wikidata](https://wiki.openstreetmap.org/wiki/Key:wikidata) | [wikidata](../SpecialInputElements.md#wikidata) |  |
| <a target="_blank" href='https://taginfo.openstreetmap.org/keys/subject:wikidata#values'><img src='https://mapcomplete.org/assets/svg/search.svg' height='18px'></a> <a target="_blank" href='https://taghistory.raifer.tech/?#***/subject%3Awikidata/'><img src='https://mapcomplete.org/assets/svg/statistics.svg' height='18px'></a> [subject:wikidata](https://wiki.openstreetmap.org/wiki/Key:subject:wikidata) | [wikidata](../SpecialInputElements.md#wikidata) |  |
| <a target="_blank" href='https://taginfo.openstreetmap.org/keys/historic#values'><img src='https://mapcomplete.org/assets/svg/search.svg' height='18px'></a> <a target="_blank" href='https://taghistory.raifer.tech/?#***/historic/'><img src='https://mapcomplete.org/assets/svg/statistics.svg' height='18px'></a> [historic](https://wiki.openstreetmap.org/wiki/Key:historic) | Multiple choice | [memorial](https://wiki.openstreetmap.org/wiki/Tag:historic%3Dmemorial) [](https://wiki.openstreetmap.org/wiki/Tag:historic%3D) |
| <a target="_blank" href='https://taginfo.openstreetmap.org/keys/amenity#values'><img src='https://mapcomplete.org/assets/svg/search.svg' height='18px'></a> <a target="_blank" href='https://taghistory.raifer.tech/?#***/amenity/'><img src='https://mapcomplete.org/assets/svg/statistics.svg' height='18px'></a> [amenity](https://wiki.openstreetmap.org/wiki/Key:amenity) | Multiple choice | [bench](https://wiki.openstreetmap.org/wiki/Tag:amenity%3Dbench) [](https://wiki.openstreetmap.org/wiki/Tag:amenity%3D) |




### historic_or_not

The question is `Is this artwork a historic advertisement?`



 -  *This artwork is a historic advertisement* is shown if with <a href='https://wiki.openstreetmap.org/wiki/Key:historic' target='_blank'>historic</a>=<a href='https://wiki.openstreetmap.org/wiki/Tag:historic%3Dadvertising' target='_blank'>advertising</a>
 -  *This artwork is not a historic advertisement* is shown if with historic=





### images
This block shows the known images which are linked with the `image`-keys, but also via `mapillary` and `wikidata` and shows the button to upload new images
_This tagrendering has no question and is thus read-only_
*{image_carousel()}{image_upload()}*




### artwork-artwork_type

The question is `What is the type of this artwork?`
*This is a {artwork_type}* is shown if `artwork_type` is set


 -  *Architecture* is shown if with <a href='https://wiki.openstreetmap.org/wiki/Key:artwork_type' target='_blank'>artwork_type</a>=<a href='https://wiki.openstreetmap.org/wiki/Tag:artwork_type%3Darchitecture' target='_blank'>architecture</a>
 -  *Mural* is shown if with <a href='https://wiki.openstreetmap.org/wiki/Key:artwork_type' target='_blank'>artwork_type</a>=<a href='https://wiki.openstreetmap.org/wiki/Tag:artwork_type%3Dmural' target='_blank'>mural</a>
 -  *Painting* is shown if with <a href='https://wiki.openstreetmap.org/wiki/Key:artwork_type' target='_blank'>artwork_type</a>=<a href='https://wiki.openstreetmap.org/wiki/Tag:artwork_type%3Dpainting' target='_blank'>painting</a>
 -  *Sculpture* is shown if with <a href='https://wiki.openstreetmap.org/wiki/Key:artwork_type' target='_blank'>artwork_type</a>=<a href='https://wiki.openstreetmap.org/wiki/Tag:artwork_type%3Dsculpture' target='_blank'>sculpture</a>
 -  *Statue* is shown if with <a href='https://wiki.openstreetmap.org/wiki/Key:artwork_type' target='_blank'>artwork_type</a>=<a href='https://wiki.openstreetmap.org/wiki/Tag:artwork_type%3Dstatue' target='_blank'>statue</a>
 -  *Bust* is shown if with <a href='https://wiki.openstreetmap.org/wiki/Key:artwork_type' target='_blank'>artwork_type</a>=<a href='https://wiki.openstreetmap.org/wiki/Tag:artwork_type%3Dbust' target='_blank'>bust</a>
 -  *Stone* is shown if with <a href='https://wiki.openstreetmap.org/wiki/Key:artwork_type' target='_blank'>artwork_type</a>=<a href='https://wiki.openstreetmap.org/wiki/Tag:artwork_type%3Dstone' target='_blank'>stone</a>
 -  *Installation* is shown if with <a href='https://wiki.openstreetmap.org/wiki/Key:artwork_type' target='_blank'>artwork_type</a>=<a href='https://wiki.openstreetmap.org/wiki/Tag:artwork_type%3Dinstallation' target='_blank'>installation</a>
 -  *Graffiti* is shown if with <a href='https://wiki.openstreetmap.org/wiki/Key:artwork_type' target='_blank'>artwork_type</a>=<a href='https://wiki.openstreetmap.org/wiki/Tag:artwork_type%3Dgraffiti' target='_blank'>graffiti</a>
 -  *Relief* is shown if with <a href='https://wiki.openstreetmap.org/wiki/Key:artwork_type' target='_blank'>artwork_type</a>=<a href='https://wiki.openstreetmap.org/wiki/Tag:artwork_type%3Drelief' target='_blank'>relief</a>
 -  *Azulejo (Spanish decorative tilework)* is shown if with <a href='https://wiki.openstreetmap.org/wiki/Key:artwork_type' target='_blank'>artwork_type</a>=<a href='https://wiki.openstreetmap.org/wiki/Tag:artwork_type%3Dazulejo' target='_blank'>azulejo</a>
 -  *Tilework* is shown if with <a href='https://wiki.openstreetmap.org/wiki/Key:artwork_type' target='_blank'>artwork_type</a>=<a href='https://wiki.openstreetmap.org/wiki/Tag:artwork_type%3Dtilework' target='_blank'>tilework</a>
 -  *Woodcarving* is shown if with <a href='https://wiki.openstreetmap.org/wiki/Key:artwork_type' target='_blank'>artwork_type</a>=<a href='https://wiki.openstreetmap.org/wiki/Tag:artwork_type%3Dwoodcarving' target='_blank'>woodcarving</a>



This tagrendering has labels 
`artwork-question`

### artwork-artist-wikidata

The question is `Who made this artwork?`
*This artwork was made by {wikidata_label(artist:wikidata):font-weight:bold}<br/>{wikipedia(artist:wikidata)}* is shown if `artist:wikidata` is set


This tagrendering has labels 
`artwork-question`

### artwork-artist_name

The question is `Which artist created this?`
*Created by {artist_name}* is shown if `artist_name` is set


This tagrendering has labels 
`artwork-question`

### artwork-website

The question is `Is there a website with more information about this artwork?`
*{link(More information on this website,&LBRACEwebsite&RBRACE,,,,)}* is shown if `website` is set


This tagrendering has labels 
`artwork-question`

### wikipedia
Shows a wikipedia box with the corresponding wikipedia article; the wikidata-item link can be changed by a contributor
The question is `What is the corresponding Wikidata entity?`
*{wikipedia():max-height:25rem}* is shown if `wikidata` is set


 -  *{wikipedia():max-height:25rem}* is shown if with wikipedia~.+. _This option cannot be chosen as answer_
 -  *No Wikipedia page has been linked yet* is shown if with wikidata=. _This option cannot be chosen as answer_





### artwork_subject

The question is `What does this artwork depict?`
*This artwork depicts {wikidata_label(subject:wikidata)}{wikipedia(subject:wikidata)}* is shown if `subject:wikidata` is set

This tagrendering is only visible in the popup if the following condition is met: subject:wikidata~.+
This tagrendering has labels 
`artwork-question`

### doubles_as_memorial

The question is `Does this artwork serve as a memorial?`



 -  *This artwork also serves as a memorial* is shown if with <a href='https://wiki.openstreetmap.org/wiki/Key:historic' target='_blank'>historic</a>=<a href='https://wiki.openstreetmap.org/wiki/Tag:historic%3Dmemorial' target='_blank'>memorial</a>
 -  *This artwork does not serve as a bench* is shown if with historic=





### doubles_as_bench

The question is `Does this artwork serve as a bench?`



 -  *This artwork also serves as a bench* is shown if with <a href='https://wiki.openstreetmap.org/wiki/Key:amenity' target='_blank'>amenity</a>=<a href='https://wiki.openstreetmap.org/wiki/Tag:amenity%3Dbench' target='_blank'>bench</a>
 -  *This artwork does not serve as a bench* is shown if with amenity=
 -  *This artwork does not serve as a bench* is shown if with amenity!=bench. _This option cannot be chosen as answer_





### leftover-questions

_This tagrendering has no question and is thus read-only_
*{questions( ,)}*




### move-button

_This tagrendering has no question and is thus read-only_
*{move_button()}*




### delete-button

_This tagrendering has no question and is thus read-only_
*{delete_button()}*




### lod

_This tagrendering has no question and is thus read-only_
*{linked_data_from_website()}*


This tagrendering has labels 
`added_by_default`

## Filters



| id | question | osmTags |
-----|-----|----- |
| has_image.0 | *With and without images* (default) |  |
| has_image.1 | Has at least one image | image~.+ | image:0~.+ | image:1~.+ | image:2~.+ | image:3~.+ | mapillary~.+ |
| has_image.2 | Probably does not have an image | image= & image:0= & image:1= & image:2= & image:3= & mapillary= |






| id | question | osmTags |
-----|-----|----- |
| artwork-artwork_type.0 | *What is the type of this artwork?* (default) |  |
| artwork-artwork_type.1 | Architecture | artwork_type=architecture |
| artwork-artwork_type.2 | Mural | artwork_type=mural |
| artwork-artwork_type.3 | Painting | artwork_type=painting |
| artwork-artwork_type.4 | Sculpture | artwork_type=sculpture |
| artwork-artwork_type.5 | Statue | artwork_type=statue |
| artwork-artwork_type.6 | Bust | artwork_type=bust |
| artwork-artwork_type.7 | Stone | artwork_type=stone |
| artwork-artwork_type.8 | Installation | artwork_type=installation |
| artwork-artwork_type.9 | Graffiti | artwork_type=graffiti |
| artwork-artwork_type.10 | Relief | artwork_type=relief |
| artwork-artwork_type.11 | Azulejo (Spanish decorative tilework) | artwork_type=azulejo |
| artwork-artwork_type.12 | Tilework | artwork_type=tilework |
| artwork-artwork_type.13 | Woodcarving | artwork_type=woodcarving |




This document is autogenerated from [assets/themes/ghostsigns/ghostsigns.json](https://github.com/pietervdvn/MapComplete/blob/develop/assets/themes/ghostsigns/ghostsigns.json)