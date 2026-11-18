# Thessla Green Card

Karta Lovelace dla rekuperatora **Thessla Green AirPack4h** (integracja Modbus). Animowany schemat przepływów, kolory rur wg temperatury, bypass, popupy, motyw jasny i ciemny.

- Dwie rury (nawiew i wywiew), każda z własnym gradientem prowadzonym wzdłuż rury od wlotu do wylotu.
- Skala temperatura → kolor konfigurowalna osobno dla nawiewu i wywiewu (presety `turbo`, `hrv` albo własne przystanki).
- Bypass: gdy siłownik jest włączony, powietrze idzie bypassem w kolorze wlotu, a odcinek przez wymiennik jest nieaktywny.
- Popupy: „Odzysk energii” (godzina / dzień / miesiąc / rok) i „Tryb specjalny”.
- Zdjęcie rekuperatora (jasne i ciemne) z automatycznym powrotem do wersji wektorowej, gdy plików brak.
- Edytor wizualny (motyw, kolory temperatur, encje, tryby specjalne).

## Instalacja przez HACS

1. HACS → menu (⋮) → **Custom repositories** → adres `https://github.com/GieOeRZet/TheslagreenModbus_card`, kategoria **Dashboard**.
2. Zainstaluj **Thessla Green Card**, odśwież przeglądarkę (Ctrl+F5).
3. Zasób (`theslagreen-card.js`, typ *JavaScript Module*) HACS dodaje sam.

Pliki karty i zdjęć (`body.png`, `body_dark.png`, `ducts.png`) trafiają do jednego folderu i karta znajduje je sama.

## Użycie

```yaml
type: custom:theslagreen-card
theme: auto            # auto | light | dark
```

### Kolory temperatur (osobno dla każdej rury)

```yaml
temperature_colors:
  nawiew:               # czerpnia -> nawiew
    preset: turbo       # turbo | hrv | custom
  wywiew:               # wywiew -> wyrzutnia
    preset: custom
    stops:
      - { temp: 0,  color: "#0000ff" }
      - { temp: 12, color: "#00c8ff" }
      - { temp: 20, color: "#ff9900" }
      - { temp: 26, color: "#ff0000" }
```

Przystanki: minimum 2, temperatura w °C, kolor hex. Kolor jest interpolowany liniowo, poza zakresem przycinany do skrajnego.

### Wygląd

| Opcja | Domyślnie | Opis |
|---|---|---|
| `theme` | `auto` | `auto` (wg motywu HA), `light`, `dark` |
| `flow_opacity` | `0.5` | przezroczystość pasm rur (0–1) |
| `font_scale` | `1.2` | skala małych napisów (etykiety), większe wartości bez zmian |
| `bypass_duct` | `true` | `false` ukrywa blady kanał bypassu, gdy jest zamknięty |
| `images.enabled` | `auto` | `auto` (zdjęcia, gdy pliki istnieją), `true`, `false` (zawsze wektor) |
| `images.path` | folder karty | adres folderu ze zdjęciami |
| `images.body` / `images.body_dark` / `images.ducts` | `body.png` / `body_dark.png` / `ducts.png` | nazwy plików |

### Encje

Wszystkie pola są opcjonalne. Domyślne nazwy: `sensor.rekuperator_*`, `switch.rekuperator_*`.

```yaml
entities:
  temp_czerpnia: sensor.rekuperator_temperatura_czerpnia
  temp_nawiew: sensor.rekuperator_temperatura_nawiew
  temp_wywiew: sensor.rekuperator_temperatura_wywiew
  temp_wyrzutnia: sensor.rekuperator_temperatura_za_fpx
  flow_nawiew: sensor.rekuperator_strumien_nawiew
  flow_wywiew: sensor.rekuperator_strumien_wywiew
  drive_nawiew: sensor.rekuperator_wysterowanie_nawiew
  drive_wywiew: sensor.rekuperator_wysterowanie_wywiew
  efficiency: sensor.rekuperator_sprawnosc
  recovered_power: sensor.rekuperator_odzyskana_moc
  energy_hour: sensor.rekuperator_odzysk_energii_godzina
  energy_day: sensor.rekuperator_odzysk_energii_dzien
  energy_month: sensor.rekuperator_odzysk_energii_miesiac
  energy_year: sensor.rekuperator_odzysk_energii_rok
  on_off: switch.rekuperator_on_off
  mode: switch.rekuperator_mode
  bypass: switch.rekuperator_bypass
  bypass_actuator: binary_sensor.rekuperator_silownik_bypassu
  winter: switch.rekuperator_zima
  manual_speed: sensor.rekuperator_speedmanual   # number / input_number => suwak działa
  special_mode: sensor.rekuperator_specjalny_tryb_pracy
  filter_change: sensor.rekuperator_wymiana_filtrow
  fpx_mode: sensor.rekuperator_fpx_tryb
  power: ""                                      # np. miernik mocy; puste = „–”
  faults: [sensor.rekuperator_error]
```

### Tryby specjalne

Domyślnie przyciski zapisują rejestr przez `modbus.write_register`. Dla integracji z encją `select` użyj `entity` i `option`:

```yaml
special_modes:
  - { name: Normalny, value: Normalny, entity: select.rekuperator_tryb_specjalny, option: Normalny }
  - { name: Wietrzenie, value: Wietrzenie, entity: select.rekuperator_tryb_specjalny, option: Wietrzenie }
```

Intensywność ręczna: suwak działa, gdy `manual_speed` to `number` lub `input_number`. Dla sensora podaj `manual_speed_set: { service: domena.usługa, data: { value: "{v}" } }`.

## Status

Wersja wczesna (0.2.1). Domyślne nazwy encji pochodzą z poprzedniej instalacji i mogą wymagać dopasowania do Twojej integracji.
