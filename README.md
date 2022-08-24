# lovelace-centrometal-boiler-card

Home assistant lovelace card to support Centrometal (https://www.centrometal.hr/) boiler with WiFi integration into Home Assistant (a free and open-source software for home automation designed to be a central control system for smart home devices with a focus on local control and privacy).

```
type: custom:centrometal-boiler-card
device_type: peltec | cmpelet | biotec | biopl (optional)
prefix: <prefix> (optional)
```
device_type:
Optional parameter, if you have only one boiler the card shall properly detect device type.
- peltec (PelTec and PelTec Lambda)
- cmpelet (CentroPlus + Cm Pelet-set, EKO-CK P + Cm Pelet-Set)
- biotec (BioTec-L)
- biopl (BioTec Plus)

prefix: <prefix>
Prefix is optional, if defined when adding device to HA all entities are prefixed with it. Here you can define the prefix for boiler entities. This is usefull if you add several boilers into system to distinguish entities per boiler.

## Multiple boilers

```
- type: custom:centrometal-boiler-card
  device_type: peltec
  prefix: john
- type: custom:centrometal-boiler-card
  device_type: cmpelet
  prefix: mike
- type: custom:centrometal-boiler-card
  device_type: biotec
  prefix: joe
- type: custom:centrometal-boiler-card
  device_type: cmpelet
  prefix: alex
- type: custom:centrometal-boiler-card
  device_type: biopl
  prefix: jack
```

![Peltec Display Example](https://github.com/9a4gl/lovelace-centrometal-boiler-card/raw/main/all-display.gif)

## PelTec Lambda

```
type: custom:centrometal-boiler-card
device_type: peltec
```

![Peltec Display Example](https://github.com/9a4gl/lovelace-centrometal-boiler-card/raw/main/peltec-display.gif)

## Centro Plus + Cm Pelet-set

```
type: custom:centrometal-boiler-card
device_type: cmpelet
```

![CentroPlus](https://github.com/9a4gl/lovelace-centrometal-boiler-card/raw/main/cmpelet-display.gif)

## BioTec-L

```
type: custom:centrometal-boiler-card
device_type: biotec
```

![BioTec](https://github.com/9a4gl/lovelace-centrometal-boiler-card/raw/main/biotec-display.gif)

## BioTec Plus

```
type: custom:centrometal-boiler-card
device_type: biopl
```

![BioTec Plus](https://github.com/9a4gl/lovelace-centrometal-boiler-card/raw/main/biotec-plus-display.gif)

## EKO-CK P + Cm Pelet-set
```
type: custom:centrometal-boiler-card
device_type: cmpelet
```

![EKO-CK P](https://github.com/9a4gl/lovelace-centrometal-boiler-card/raw/main/eko-ckp-display.gif)

