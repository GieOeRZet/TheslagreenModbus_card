/*! theslagreen-card v0.3.0 – karta rekuperatora Thessla Green AirPack4h dla Home Assistant */
(() => {
const VERSION = '0.3.0';
const BASE = (() => { try { return new URL('.', import.meta.url).href; } catch (e) { return '/local/community/theslagreen-card/'; } })();

/* ------------------------------------------------------------------ geometria */
const X0 = -175, Y0 = 95, W = 1153, H = 480, YT = 226, YB = 473;
const FILT_L = 'M150.6 339.9 L154.5 339.2 L157.5 338.1 L160.0 336.6 L162.6 334.1 L164.1 332.2 L165.6 329.5 L167.3 322.5 L174.3 278.5 L175.4 270.5 L175.6 266.5 L177.4 255.5 L177.6 250.5 L178.4 246.5 L178.6 242.5 L179.4 238.5 L179.6 233.5 L180.4 229.5 L180.6 223.5 L181.4 219.5 L181.6 212.5 L182.4 208.5 L182.6 202.5 L183.4 198.5 L183.6 189.5 L184.4 185.5 L184.4 173.5 L183.6 170.5 L181.1 166.4 L177.0 162.4 L172.5 160.3 L162.5 158.6 L158.5 158.4 L154.5 157.6 L149.5 157.4 L138.5 155.6 L134.5 155.4 L130.5 154.6 L125.5 154.4 L121.5 153.6 L113.5 153.5 L110.5 154.0 L106.0 156.4 L103.7 158.0 L102.4 159.5 L99.9 163.5 L98.8 166.5 L96.4 181.5 L94.7 189.5 L89.6 224.5 L89.4 228.5 L86.6 248.5 L86.4 253.5 L84.6 265.5 L84.5 271.5 L83.6 276.5 L83.4 282.5 L82.6 286.5 L82.5 293.5 L81.6 298.5 L81.5 304.5 L80.5 311.5 L80.7 319.5 L81.6 322.5 L82.9 325.2 L87.4 330.1 L93.3 333.9 Z';
const FILT_R = 'M709.7 333.9 L715.6 330.1 L720.1 325.2 L721.4 322.5 L722.3 319.5 L722.5 314.5 L722.4 311.5 L721.5 306.5 L721.4 300.5 L720.5 295.5 L720.4 287.5 L719.6 283.5 L719.4 277.5 L718.6 273.5 L718.4 267.5 L717.6 263.5 L717.4 258.5 L716.6 254.5 L716.4 249.5 L715.6 245.5 L713.4 225.5 L709.3 196.5 L704.3 167.5 L703.4 164.5 L702.1 161.8 L697.6 156.9 L693.5 154.4 L690.5 153.6 L682.5 153.5 L669.5 155.4 L665.5 155.6 L661.5 156.4 L657.5 156.6 L653.5 157.4 L649.5 157.6 L645.5 158.4 L640.5 158.6 L631.5 160.0 L627.6 161.4 L624.9 163.4 L620.9 167.8 L618.8 172.5 L618.5 185.5 L619.5 191.5 L619.5 198.5 L620.5 204.5 L620.6 210.5 L621.4 214.5 L621.6 220.5 L622.5 225.5 L622.6 230.5 L624.4 242.5 L625.6 256.5 L628.4 274.5 L628.7 279.5 L636.0 324.5 L637.0 328.5 L638.4 331.4 L639.9 333.6 L643.0 336.6 Z';
const HEX = '333,232 457,237 530,372 462,492 358,495 262,350';
const DUCTS = [[8, 160, 24, 132], [8, 408, 24, 130], [774, 160, 24, 132], [774, 408, 24, 130]];
const FRESH = [['M', 18, 226], ['L', 172, 226], ['C', 205, 226, 227.95, 240.2, 252.9, 256.8],
  ['L', 521.7, 435.8], ['C', 546.65, 452.4, 586.2, 473, 624.2, 473], ['L', 785, 473]];
const mx = x => Math.round((803 - x) * 10) / 10;
const P = (segs, mirror) => segs.map(s => s[0] + ' ' + s.slice(1).map((v, i) => (mirror && i % 2 === 0) ? mx(v) : v).join(' ')).join(' ');
const FW = 112;
function samplePath(segs, mirror) {
  const X = x => mirror ? Math.round((803 - x) * 10) / 10 : x; const pts = []; let cur = null;
  for (const sg of segs) {
    if (sg[0] === 'M') { cur = [X(sg[1]), sg[2]]; pts.push(cur); }
    else if (sg[0] === 'L') { const e = [X(sg[1]), sg[2]], n = Math.max(1, Math.ceil(Math.hypot(e[0] - cur[0], e[1] - cur[1]) / 2)); for (let i = 1; i <= n; i++) pts.push([cur[0] + (e[0] - cur[0]) * i / n, cur[1] + (e[1] - cur[1]) * i / n]); cur = e; }
    else { const p0 = cur, p1 = [X(sg[1]), sg[2]], p2 = [X(sg[3]), sg[4]], p3 = [X(sg[5]), sg[6]]; for (let i = 1; i <= 40; i++) { const t = i / 40, u = 1 - t, a = u * u * u, b = 3 * u * u * t, c = 3 * u * t * t, d = t * t * t; pts.push([a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0], a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1]]); } cur = p3; }
  }
  const cum = [0]; for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  return { pts, cum, L: cum[cum.length - 1] };
}
const BYP = [['M', 172, 226], ['L', 460, 226], ['C', 515.2, 226, 560, 270.8, 560, 326], ['L', 560, 373], ['C', 560, 428.2, 604.8, 473, 660, 473], ['L', 690, 473]];
const SP_F = samplePath(FRESH, false), SP_E = samplePath(FRESH, true), SP_B = samplePath(BYP, false);
const S_BR = SP_F.cum[SP_F.pts.findIndex(p => p[0] >= 172 - 1e-6)];
const S_JN = SP_F.cum[SP_F.pts.findIndex(p => p[0] >= 660 && p[1] > 472.9)];
const ptsD = a => 'M' + a.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L');
const BYP_FLOW = ptsD([...SP_F.pts.filter((p, i) => SP_F.cum[i] <= S_BR), ...SP_B.pts, ...SP_F.pts.filter((p, i) => SP_F.cum[i] >= S_JN)]);
const FONT = "Inter,Roboto,'Segoe UI',system-ui,sans-serif";

/* ------------------------------------------------------------------ skale temperatur */
const PRESETS = {
  turbo: [[-10, '#30123b'], [-5, '#466be3'], [0, '#28bceb'], [5, '#32f298'], [10, '#a4fc3c'], [15, '#eecf3a'], [20, '#fb7e21'], [25, '#d02f05'], [30, '#7a0403']],
  hrv: [[0, '#0000ff'], [8, '#00c8ff'], [16, '#ff9900'], [22, '#ff0000']],
};
const PRESET_LABELS = { turbo: 'Turbo (mapa kolorów)', hrv: 'Klasyczna niebiesko-czerwona', custom: 'Własna' };
const rgb = h => [1, 3, 5].map(k => parseInt(h.substr(k, 2), 16));
const hex = a => '#' + a.map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
const shade = (h, k) => hex(rgb(h).map(v => v * k));
const lum = h => { const l = c => (c /= 255) <= .03928 ? c / 12.92 : Math.pow((c + .055) / 1.055, 2.4); const [r, g, b] = rgb(h).map(l); return .2126 * r + .7152 * g + .0722 * b; };
function stopsOf(sc) {
  let st = null;
  if (sc && sc.preset === 'custom' && Array.isArray(sc.stops) && sc.stops.length >= 2) st = sc.stops.map(s => [Number(s.temp), s.color]);
  else if (sc && PRESETS[sc.preset]) st = PRESETS[sc.preset];
  else if (sc && Array.isArray(sc.stops) && sc.stops.length >= 2) st = sc.stops.map(s => [Number(s.temp), s.color]);
  if (!st) st = PRESETS.turbo;
  return st.filter(s => isFinite(s[0]) && /^#[0-9a-f]{6}$/i.test(s[1])).sort((a, b) => a[0] - b[0]);
}
function colorAt(st, T) {
  if (T <= st[0][0]) return st[0][1];
  if (T >= st[st.length - 1][0]) return st[st.length - 1][1];
  for (let i = 0; i < st.length - 1; i++) {
    const [t0, c0] = st[i], [t1, c1] = st[i + 1];
    if (T >= t0 && T <= t1) { const f = t1 === t0 ? 0 : (T - t0) / (t1 - t0); const a = rgb(c0), b = rgb(c1); return hex(a.map((v, j) => v + (b[j] - v) * f)); }
  }
  return st[0][1];
}
const gradStops = (st, T0, T1, n = 16) => Array.from({ length: n + 1 }, (_, i) => `<stop offset="${(i / n).toFixed(4)}" stop-color="${colorAt(st, T0 + (T1 - T0) * i / n)}"/>`).join('');

/* ------------------------------------------------------------------ motywy */
const THEMES = {
  light: { bg1: '#c3cad4', bg2: '#aab3bf', text: '#171d23', muted: '#46525f', panel: '#ffffff', pstroke: '#d5dbe1', on: '#2f80ed', ok: '#43b04a',
    body1: '#f2f4f7', body2: '#dde2e8', bodyLine: '#b6bec8', hexfill: '#f9fafb', hexLine: '#aab1b9', filt: '#f7f8fa', filtLine: '#14171a', filtW: 2.5,
    duct: '#14171a', ductLine: null, cap: '#14171a', grille: '#98a1ab', shadow: true, labelK: .78 },
  dark: { bg1: '#141a22', bg2: '#0d1117', text: '#e9eef3', muted: '#8793a0', panel: '#1b222b', pstroke: '#2c3641', on: '#3d9bff', ok: '#6fe05a',
    body1: '#39414b', body2: '#262c34', bodyLine: '#4a535e', hexfill: '#2d343d', hexLine: '#b4bec9', filt: '#2b323a', filtLine: '#dfe6ee', filtW: 2.4,
    duct: '#0b0d10', ductLine: '#3b4048', cap: '#0b0d10', grille: '#6e7883', shadow: false, labelK: 1 },
};

/* ------------------------------------------------------------------ domyślna konfiguracja */
const DEFAULT_ENTITIES = {
  temp_czerpnia: 'sensor.rekuperator_temperatura_czerpnia',
  temp_nawiew: 'sensor.rekuperator_temperatura_nawiew',
  temp_wywiew: 'sensor.rekuperator_temperatura_wywiew',
  temp_wyrzutnia: 'sensor.rekuperator_temperatura_za_fpx',
  flow_nawiew: 'sensor.rekuperator_strumien_nawiew',
  flow_wywiew: 'sensor.rekuperator_strumien_wywiew',
  drive_nawiew: 'sensor.rekuperator_wysterowanie_nawiew',
  drive_wywiew: 'sensor.rekuperator_wysterowanie_wywiew',
  efficiency: 'sensor.rekuperator_sprawnosc',
  recovered_power: 'sensor.rekuperator_odzyskana_moc',
  energy_hour: 'sensor.rekuperator_odzysk_energii_godzina',
  energy_day: 'sensor.rekuperator_odzysk_energii_dzien',
  energy_month: 'sensor.rekuperator_odzysk_energii_miesiac',
  energy_year: 'sensor.rekuperator_odzysk_energii_rok',
  on_off: 'switch.rekuperator_on_off',
  mode: 'switch.rekuperator_mode',
  bypass: 'switch.rekuperator_bypass',
  bypass_actuator: 'binary_sensor.rekuperator_silownik_bypassu',
  winter: 'switch.rekuperator_zima',
  manual_speed: 'sensor.rekuperator_speedmanual',
  special_mode: 'sensor.rekuperator_specjalny_tryb_pracy',
  filter_change: 'sensor.rekuperator_wymiana_filtrow',
  fpx_mode: 'sensor.rekuperator_fpx_tryb',
  power: 'sensor.shellypmminig3_dcda0cb32f70_power',
  faults: ['sensor.rekuperator_error', 'sensor.rekuperator_awaria_cf_nawiewu', 'sensor.rekuperator_awaria_cf_wywiewu',
    'sensor.rekuperator_awaria_wentylatora_nawiewu', 'sensor.rekuperator_awaria_wentylatora_wywiewu'],
};
const ENTITY_LABELS = {
  temp_czerpnia: 'Temperatura – czerpnia', temp_nawiew: 'Temperatura – nawiew', temp_wywiew: 'Temperatura – wywiew', temp_wyrzutnia: 'Temperatura – wyrzutnia',
  flow_nawiew: 'Strumień – nawiew', flow_wywiew: 'Strumień – wywiew', drive_nawiew: 'Wysterowanie – nawiew', drive_wywiew: 'Wysterowanie – wywiew',
  efficiency: 'Sprawność odzysku', recovered_power: 'Odzyskana moc', energy_hour: 'Odzysk energii – godzina', energy_day: 'Odzysk energii – dzień',
  energy_month: 'Odzysk energii – miesiąc', energy_year: 'Odzysk energii – rok', on_off: 'Przełącznik ON/OFF', mode: 'Przełącznik AUTO (mode)',
  bypass: 'Przełącznik BYPASS', bypass_actuator: 'Siłownik bypassu (stan rzeczywisty)', winter: 'Przełącznik ZIMA (wył. = LATO)',
  manual_speed: 'Intensywność ręczna (number / sensor)', special_mode: 'Tryb specjalny – stan', filter_change: 'Wymiana filtrów', fpx_mode: 'Nagrzewnica FPX – tryb',
  power: 'Pobór mocy (np. Shelly)',
};
const ENTITY_GROUPS = [
  ['Temperatury', ['temp_czerpnia', 'temp_nawiew', 'temp_wywiew', 'temp_wyrzutnia']],
  ['Przepływy i wysterowanie', ['flow_nawiew', 'flow_wywiew', 'drive_nawiew', 'drive_wywiew']],
  ['Odzysk', ['efficiency', 'recovered_power', 'energy_hour', 'energy_day', 'energy_month', 'energy_year']],
  ['Sterowanie', ['on_off', 'mode', 'bypass', 'bypass_actuator', 'winter', 'manual_speed', 'special_mode']],
  ['Statusy', ['filter_change', 'fpx_mode', 'power']],
];
const DEFAULT_MODES = [
  { name: 'Normalny', value: '0', service: 'modbus.write_register', data: { hub: 'reku', address: 4224, slave: 9, value: 0 } },
  { name: 'Wietrzenie', value: '7', service: 'modbus.write_register', data: { hub: 'reku', address: 4224, slave: 9, value: 7 } },
  { name: 'Otwarte okna', value: '10', service: 'modbus.write_register', data: { hub: 'reku', address: 4224, slave: 9, value: 10 } },
  { name: 'Pusty dom', value: '11', service: 'modbus.write_register', data: { hub: 'reku', address: 4224, slave: 9, value: 11 } },
];
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function normalize(c) {
  const cfg = JSON.parse(JSON.stringify(c || {}));
  cfg.theme = cfg.theme || 'auto';
  cfg.entities = Object.assign({}, DEFAULT_ENTITIES, cfg.entities || {});
  const tc = cfg.temperature_colors || {};
  cfg.temperature_colors = { nawiew: tc.nawiew || { preset: 'turbo' }, wywiew: tc.wywiew || { preset: 'turbo' } };
  cfg.images = Object.assign({ enabled: 'auto', path: BASE, body: 'body.png', body_dark: 'body_dark.png', ducts: 'ducts.png' }, cfg.images || {});
  if (!Array.isArray(cfg.special_modes) || !cfg.special_modes.length) cfg.special_modes = DEFAULT_MODES;
  return cfg;
}

/* ------------------------------------------------------------------ karta */
class TheslaGreenCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._popup = null; this._sig = null; this._drag = null;
    this.shadowRoot.addEventListener('click', e => this._click(e));
    this.shadowRoot.addEventListener('pointerdown', e => this._down(e));
    this.shadowRoot.addEventListener('input', e => this._input(e));
    this.shadowRoot.addEventListener('change', e => this._change(e));
  }
  static getConfigElement() { return document.createElement('theslagreen-card-editor'); }
  static getStubConfig() { return { type: 'custom:theslagreen-card', theme: 'auto' }; }
  setConfig(c) { this._cfg = normalize(c); this._imgState = {}; this._sig = null; this._popup = null; if (this._hass) this._render(); }
  getCardSize() { return 6; }
  getGridOptions() { return { columns: 12, rows: 'auto', min_columns: 6 }; }
  set hass(h) {
    this._hass = h;
    if (!this._cfg || this._drag) return;
    const sig = this._signature();
    if (sig !== this._sig) { this._sig = sig; this._render(); }
  }
  _photo(dark) {
    const im = this._cfg.images; if (im.enabled === false) return false;
    const key = dark ? 'dark' : 'light', file = dark ? im.body_dark : im.body;
    this._imgState = this._imgState || {};
    if (this._imgState[key] === undefined) {
      this._imgState[key] = null; const i = new Image();
      i.onload = () => { this._imgState[key] = true; this._sig = null; this._render(); };
      i.onerror = () => { this._imgState[key] = false; };
      i.src = im.path + file;
    }
    return this._imgState[key] === true;
  }
  _ids() { const e = this._cfg.entities; return Object.keys(e).flatMap(k => Array.isArray(e[k]) ? e[k] : [e[k]]).filter(Boolean); }
  _signature() {
    const h = this._hass;
    return this._ids().map(id => { const s = h.states[id]; return s ? s.state : '?'; }).join('|') + '#' + this._dark() + '#' + (this._popup || '') + '#' + JSON.stringify(this._cfg);
  }
  _dark() { if (this._cfg.theme === 'dark') return true; if (this._cfg.theme === 'light') return false; return !!(this._hass && this._hass.themes && this._hass.themes.darkMode); }
  _st(k) { const id = this._cfg.entities[k]; return id && this._hass.states[id]; }
  _num(k) { const s = this._st(k); if (!s) return NaN; const v = parseFloat(s.state); return isFinite(v) ? v : NaN; }
  _on(k) { const s = this._st(k); return !!s && s.state === 'on'; }
  _unit(k) { const s = this._st(k); return s && s.attributes && s.attributes.unit_of_measurement || ''; }

  /* ---------- akcje ---------- */
  _more(id) { if (!id) return; this.dispatchEvent(new CustomEvent('hass-more-info', { bubbles: true, composed: true, detail: { entityId: id } })); }
  _toggle(k) { const id = this._cfg.entities[k]; if (!id) return; const d = id.split('.')[0]; if (['switch', 'input_boolean', 'light', 'fan'].includes(d)) this._hass.callService('homeassistant', 'toggle', { entity_id: id }); else this._more(id); }
  _setBool(k, on) { const id = this._cfg.entities[k]; if (!id) return; this._hass.callService('homeassistant', on ? 'turn_on' : 'turn_off', { entity_id: id }); }
  _runMode(m) {
    if (m.service) { const [d, s] = m.service.split('.'); this._hass.callService(d, s, m.data || {}); }
    else if (m.entity && m.option) { this._hass.callService('select', 'select_option', { entity_id: m.entity, option: m.option }); }
    this._popup = null; this._sig = null; this._render();
  }
  _setSpeed(v) {
    const id = this._cfg.entities.manual_speed; if (!id) return;
    const d = id.split('.')[0]; const ms = this._cfg.manual_speed_set;
    if (d === 'number' || d === 'input_number') this._hass.callService(d, 'set_value', { entity_id: id, value: v });
    else if (ms && ms.service) { const [dd, ss] = ms.service.split('.'); const data = JSON.parse(JSON.stringify(ms.data || {}).replace(/"\{v\}"/g, String(v))); this._hass.callService(dd, ss, data); }
  }
  _speedWritable() { const id = this._cfg.entities.manual_speed; const d = id && id.split('.')[0]; return d === 'number' || d === 'input_number' || !!(this._cfg.manual_speed_set && this._cfg.manual_speed_set.service); }
  _click(e) {
    const t = e.target.closest('[data-act]'); if (!t) return;
    const a = t.getAttribute('data-act'), v = t.getAttribute('data-v');
    if (a === 'close' && t.classList.contains('ov') && e.target !== t) return;
    if (a === 'toggle') this._toggle(v);
    else if (a === 'season') this._setBool('winter', v === 'zima');
    else if (a === 'more') this._more(v);
    else if (a === 'popup' || a === 'tab') { this._popup = v; this._sig = null; this._render(); }
    else if (a === 'close') { this._popup = null; this._sig = null; this._render(); }
    else if (a === 'mode') this._runMode(this._cfg.special_modes[parseInt(v, 10)]);
  }
  _down(e) { if (e.target.closest && e.target.closest('input[type=range]')) this._drag = true; }
  _input(e) { const r = e.target; if (!r || r.type !== 'range') return; const o = this.shadowRoot.getElementById('sl-val'); if (o) o.textContent = r.value; const f = this.shadowRoot.getElementById('sl-fill'); if (f) f.style.width = r.value + '%'; }
  _change(e) { const r = e.target; if (!r || r.type !== 'range') return; this._setSpeed(parseInt(r.value, 10)); this._drag = null; this._sig = null; }

  /* ---------- render ---------- */
  _render() {
    if (!this._cfg || !this._hass) return;
    const dark = this._dark(); const t = dark ? THEMES.dark : THEMES.light;
    this.shadowRoot.innerHTML = `<style>
      :host{display:block}
      ha-card{overflow:hidden;background:${t.bg2};border-radius:var(--ha-card-border-radius,14px)}
      svg{display:block;width:100%;height:auto;user-select:none;-webkit-user-select:none;touch-action:pan-y}
      [data-act]{cursor:pointer}
      text{font-family:${FONT}}
      @keyframes pulse{0%,100%{opacity:1}50%{opacity:.45}}
      .alarm{animation:pulse 1.4s infinite}
      .ui,.ov{font-family:${FONT};color:${t.text}}
      .strip{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;padding:8px 10px 12px}
      .tile{display:flex;align-items:center;gap:10px;background:${t.panel};border:1px solid ${t.pstroke};border-radius:14px;padding:9px 12px;min-width:0}
      .tile .ic{flex:none;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:${t.on}}
      .tile .ic svg{width:18px;height:18px;fill:none;stroke:#fff;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round}
      .tile small{display:block;font-size:10.5px;font-weight:700;letter-spacing:.7px;color:${t.muted};text-transform:uppercase}
      .tile b{display:block;font-size:16px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .tile.bad{grid-column:1/-1;border-color:#e5484d;background:#e5484d22}.tile.bad b,.tile.bad small{color:#e5484d}
      .ov{position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:12px;box-sizing:border-box}
      .pn{background:${t.panel};border:1px solid ${t.pstroke};border-radius:22px;width:100%;max-width:520px;max-height:92vh;overflow:auto;padding:18px 22px 22px;box-sizing:border-box;box-shadow:0 12px 40px #0006}
      .hd{display:flex;align-items:center;justify-content:space-between}.hd h2{margin:0;font-size:20px}
      .x{cursor:pointer;font-size:26px;line-height:1;padding:4px 8px;color:${t.muted}}
      .tabs{display:flex;gap:22px;border-bottom:1px solid ${t.pstroke};margin:8px 0 16px}
      .tabs span{cursor:pointer;padding:8px 2px;font-weight:700;font-size:15px;color:${t.muted};border-bottom:3px solid transparent;margin-bottom:-1px}
      .tabs span.on{color:${t.on};border-color:${t.on}}
      .g2{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px}
      .tg{cursor:pointer;display:flex;align-items:center;gap:10px;min-height:50px;box-sizing:border-box;padding:0 14px;border-radius:14px;border:1.2px solid ${t.pstroke};background:${t.panel};font-size:16px;font-weight:700}
      .tg i{flex:none;width:14px;height:14px;border-radius:50%;border:2px solid ${t.muted};box-sizing:border-box}
      .tg.on{border-width:2px}.tg.on i{border:0}
      .seg{display:flex;background:${t.bg2};border-radius:14px;padding:4px;min-height:50px;box-sizing:border-box}
      .seg span{flex:1;display:flex;align-items:center;justify-content:center;border-radius:11px;cursor:pointer;font-weight:700;font-size:15px;color:${t.muted}}
      .seg span.on{background:${t.on};color:#fff}
      .lb{display:flex;justify-content:space-between;align-items:baseline;margin:18px 0 8px;font-size:12px;font-weight:700;letter-spacing:1px;color:${t.muted}}
      .lb b{font-size:24px;color:${t.text};letter-spacing:0}.lb b small{font-size:14px;color:${t.muted}}
      input[type=range]{width:100%;height:34px;accent-color:${t.on};margin:0}
      input[type=range]:disabled{opacity:.45}
      .md{display:grid;grid-template-columns:1fr 1fr;gap:10px}
      .md div{cursor:pointer;min-height:48px;display:flex;align-items:center;justify-content:center;border-radius:13px;background:${t.bg2};font-weight:700;font-size:16px;text-align:center;padding:0 8px;box-sizing:border-box}
      .md div.on{background:${t.on};color:#fff}
      .st{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px}
      .st div{cursor:pointer;background:${t.bg2};border-radius:12px;padding:10px 12px}
      .st small{display:block;font-size:10.5px;font-weight:700;letter-spacing:.8px;color:${t.muted}}
      .st b{font-size:22px;font-weight:700}.st b span{font-size:13px;color:${t.muted};font-weight:600}
    </style><ha-card>${this._svg(t, dark)}<div class="ui">${this._strip()}</div>${this._popupHtml()}</ha-card>`;
  }
  /* wspólne odczyty dla paska i popupu */
  _info() {
    const c = this._cfg, E = c.entities;
    const on = this._st('on_off') ? this._on('on_off') : true;
    const auto = this._on('mode'), bypassSw = this._on('bypass'), winter = this._on('winter');
    const sv = this._num('manual_speed'), wr = this._speedWritable();
    const modes = c.special_modes, sm = this._st('special_mode');
    const cur = modes.find(m => m.value !== undefined && sm && String(m.value) === String(parseFloat(sm.state))) || modes.find(m => m.value !== undefined && sm && String(m.value) === sm.state);
    const faults = (Array.isArray(E.faults) ? E.faults : []).filter(id => { const st = this._hass.states[id]; const v = st && parseFloat(st.state); return isFinite(v) && v !== 0; });
    return { E, on, auto, bypassSw, winter, sv, wr, modes, cur, faults };
  }
  _strip() {
    const { on, auto, sv, cur, winter, faults, E } = this._info();
    const special = cur && String(cur.value) !== '0' ? cur.name : null;
    const mode = !on ? 'Wyłączony' : (special || (auto ? 'AUTO' : 'Ręczny')) + (isFinite(sv) && !special ? ' · ' + Math.round(sv) + '%' : '');
    const ic = { mode: '<svg viewBox="-12 -12 24 24"><path d="M-10 6 L-4 -6 L2 2 L10 -10"/></svg>',
      sun: '<svg viewBox="-12 -12 24 24"><circle r="4.5"/><path d="M0 -11v3M0 8v3M-11 0h3M8 0h3M-8 -8l2 2M6 6l2 2M-8 8l2 -2M6 -6l2 -2"/></svg>',
      flake: '<svg viewBox="-12 -12 24 24"><path d="M0 -11V11M-9.5 -5.5L9.5 5.5M-9.5 5.5L9.5 -5.5"/></svg>',
      warn: '<svg viewBox="-12 -12 24 24"><path d="M0 -9V2M0 8v.5"/></svg>' };
    let h = `<div class="strip"><div class="tile" data-act="popup" data-v="sterowanie"><span class="ic">${ic.mode}</span><span><small>Tryb</small><b>${esc(mode)}</b></span></div>`;
    h += `<div class="tile" data-act="popup" data-v="sterowanie"><span class="ic" style="background:${winter ? '#4a9fe8' : '#d9a300'}">${winter ? ic.flake : ic.sun}</span><span><small>Sezon</small><b>${winter ? 'zima' : 'lato'}</b></span></div>`;
    if (faults.length) h += `<div class="tile bad" data-act="more" data-v="${esc(faults[0])}"><span class="ic" style="background:#e5484d">${ic.warn}</span><span><small>Alarm</small><b class="alarm">AWARIA (${faults.length})</b></span></div>`;
    return h + '</div>';
  }
  _popupHtml() {
    if (!this._popup) return '';
    const I = this._info(), { E, on, auto, bypassSw, winter, sv, wr, modes, cur } = I;
    const tab = this._popup === 'energia' ? 'energia' : 'sterowanie';
    const f1 = (v, d = 1) => isFinite(v) ? v.toFixed(d) : '–';
    let b = '';
    if (tab === 'sterowanie') {
      const tg = (lab, act, key, cc) => `<div class="tg${act ? ' on' : ''}" style="${act ? 'border-color:' + cc : ''}" data-act="toggle" data-v="${key}"><i style="${act ? 'background:' + cc : ''}"></i>${lab}</div>`;
      const vv = isFinite(sv) ? Math.max(0, Math.min(100, sv)) : 0;
      b += `<div class="g2">${tg('ON / OFF', on, 'on_off', '#43b04a')}${tg('AUTO', auto, 'mode', '#2f80ed')}${tg('BYPASS', bypassSw, 'bypass', '#1fa97a')}<div class="seg"><span class="${winter ? '' : 'on'}" data-act="season" data-v="lato">LATO</span><span class="${winter ? 'on' : ''}" data-act="season" data-v="zima">ZIMA</span></div></div>`;
      b += `<div class="lb"><span>INTENSYWNOŚĆ RĘCZNA${auto && wr ? ' (AUTO)' : (!wr ? ' (tylko odczyt)' : '')}</span><b><span id="sl-val">${isFinite(sv) ? Math.round(vv) : '–'}</span><small> %</small></b></div>`;
      b += `<input type="range" min="0" max="100" step="1" value="${vv}"${wr ? '' : ' disabled'}>`;
      b += `<div class="lb"><span>TRYB SPECJALNY</span></div><div class="md">${modes.map((m, i) => `<div class="${cur === m ? 'on' : ''}" data-act="mode" data-v="${i}">${esc(m.name)}</div>`).join('')}</div>`;
    } else {
      const u = k => esc(this._unit(k) || 'kWh');
      const eff = this._num('efficiency'), pw = this._num('recovered_power'), pwr = this._num('power'), fpx = this._st('fpx_mode');
      const fpxOn = fpx && isFinite(parseFloat(fpx.state)) && parseFloat(fpx.state) !== 0;
      const big = v => isFinite(v) ? (v >= 1000 ? Math.round(v).toLocaleString('pl-PL') : v.toFixed(v >= 100 ? 0 : 1)) : '–';
      const cell = (lab, val, unit, id) => `<div data-act="more" data-v="${esc(id || '')}"><small>${lab}</small><b>${val}<span> ${unit}</span></b></div>`;
      b += `<div class="st">${cell('SPRAWNOŚĆ', f1(eff), '%', E.efficiency)}${cell('MOC ODZYSKU', isFinite(pw) ? Math.round(pw) : '–', esc(this._unit('recovered_power') || 'W'), E.recovered_power)}${cell('POBÓR MOCY', isFinite(pwr) ? Math.round(pwr) : '–', esc(this._unit('power') || 'W'), E.power)}${cell('NAGRZEWNICA', fpx ? (fpxOn ? 'aktywna' : 'wył.') : '–', '', E.fpx_mode)}`;
      b += [['GODZINA', 'energy_hour'], ['DZIEŃ', 'energy_day'], ['MIESIĄC', 'energy_month'], ['ROK', 'energy_year']].map(([lab, k]) => cell('ODZYSK – ' + lab, big(this._num(k)), u(k), E[k])).join('') + '</div>';
    }
    return `<div class="ov" data-act="close"><div class="pn"><div class="hd"><h2>Rekuperator</h2><span class="x" data-act="close">×</span></div><div class="tabs"><span class="${tab === 'sterowanie' ? 'on' : ''}" data-act="tab" data-v="sterowanie">Sterowanie</span><span class="${tab === 'energia' ? 'on' : ''}" data-act="tab" data-v="energia">Energia</span></div>${b}</div></div>`;
  }
  _svg(t, dark) {
    const c = this._cfg, E = c.entities;
    const f = (v, d = 1) => isFinite(v) ? v.toFixed(d) : '–';
    const T = { czerpnia: this._num('temp_czerpnia'), nawiew: this._num('temp_nawiew'), wywiew: this._num('temp_wywiew'), wyrzutnia: this._num('temp_wyrzutnia') };
    const sN = stopsOf(c.temperature_colors.nawiew), sW = stopsOf(c.temperature_colors.wywiew);
    const tv = (v, d) => isFinite(v) ? v : d;
    const on = this._st('on_off') ? this._on('on_off') : true;
    const bypassOpen = this._on('bypass_actuator');
    const flowN = this._num('flow_nawiew'), flowW = this._num('flow_wywiew');
    const col = (st, v) => { const x = colorAt(st, tv(v, 15)); return shade(x, t.labelK); };
    const fresh = P(FRESH), exh = P(FRESH, true); const FO = isFinite(parseFloat(c.flow_opacity)) ? parseFloat(c.flow_opacity) : .5;
    const pan = t.shadow ? ' filter="url(#shs)"' : '';

    let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${X0} ${Y0} ${W} ${H}">`;
    /* defs */
    s += `<defs>
<mask id="xm" maskUnits="userSpaceOnUse" x="-100" y="100" width="1000" height="520"><rect x="-100" y="100" width="1000" height="520" fill="#fff"/><path d="${fresh}" fill="none" stroke="#000" stroke-width="${FW + 22}"/></mask>
<filter id="tsh" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="1" stdDeviation="1.4" flood-color="#000" flood-opacity=".55"/></filter>
<filter id="sh" x="-8%" y="-8%" width="116%" height="120%"><feDropShadow dx="0" dy="7" stdDeviation="8" flood-color="#000" flood-opacity=".3"/></filter>
<filter id="shs" x="-10%" y="-20%" width="120%" height="150%"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#000" flood-opacity=".14"/></filter>
<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.bg1}"/><stop offset="1" stop-color="${t.bg2}"/></linearGradient>
<linearGradient id="bd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.body1}"/><stop offset="1" stop-color="${t.body2}"/></linearGradient>
<pattern id="grille" width="4" height="4" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.1" fill="${t.grille}"/></pattern>
${bypassOpen ? `<mask id="bm" maskUnits="userSpaceOnUse" x="-100" y="100" width="1000" height="520"><rect x="-100" y="100" width="1000" height="520" fill="#fff"/><path d="${P(BYP)}" fill="none" stroke="#000" stroke-width="${FW - 4}"/></mask>` : ''}
${bypassOpen ? `<mask id="em" maskUnits="userSpaceOnUse" x="-100" y="100" width="1000" height="520"><rect x="-100" y="100" width="1000" height="520" fill="#fff"/><path d="${exh}" fill="none" stroke="#000" stroke-width="${FW}"/></mask>` : ''}
<path id="pf" d="${bypassOpen ? BYP_FLOW : fresh}"/><path id="pe" d="${exh}"/>
</defs>`;
    s += `<rect x="${X0}" y="${Y0}" width="${W}" height="${H}" fill="url(#bg)"/>`;
    /* korpus */
    const ph = this._photo(dark), IM = c.images;
    if (ph) s += `<image href="${esc(IM.path + (dark ? IM.body_dark : IM.body))}" x="0" y="0" width="801" height="706" filter="url(#sh)"/>`;
    else {
      s += `<rect x="28" y="118" width="750" height="465" rx="14" fill="url(#bd)" stroke="${t.bodyLine}" stroke-width="1.2" filter="url(#sh)"/>`;
      s += `<rect x="352" y="153" width="100" height="12" fill="url(#grille)"/>`;
      s += `<polygon points="${HEX}" fill="${t.hexfill}" stroke="${t.hexLine}" stroke-width="2.4" stroke-linejoin="round"/>`;
      s += `<rect x="462" y="210" width="44" height="40" rx="12" transform="rotate(-18 484 230)" fill="${t.cap}"/>`;
      s += `<rect x="311" y="490" width="52" height="32" rx="9" fill="${t.cap}"/>`;
      for (const d of [FILT_L, FILT_R]) s += `<path d="${d}" fill="${t.filt}" stroke="none"/>`;
    }
    /* rury */
    const GREY = '#8f99a3';
    const pieces = (sp, a0, a1, colFn) => {
      const n = Math.max(2, Math.ceil(72 * (a1 - a0) / sp.L)); let o = '';
      for (let i = 0; i < n; i++) {
        const a = a0 + i * (a1 - a0) / n, b = Math.min(a1, a0 + (i + 1) * (a1 - a0) / n + 12), seg = [];
        for (let j = 0; j < sp.pts.length; j++) if (sp.cum[j] >= a - 1e-6 && sp.cum[j] <= b) seg.push(sp.pts[j][0].toFixed(1) + ' ' + sp.pts[j][1].toFixed(1));
        if (seg.length < 2) continue;
        o += `<path d="M${seg.join(' L')}" fill="none" stroke="${colFn((a + b) / 2)}" stroke-width="${FW}" stroke-linejoin="round"/>`;
      }
      return o;
    };
    const parts = (id, flow) => {
      if (!on) return '';
      const sp = 40 + (isFinite(flow) ? flow : 60) * 1.3, dur = Math.max(2.5, 1000 / sp), N = 6; let o = '';
      for (const dy of [-32, 0, 32]) {
        o += `<g transform="translate(0,${dy})">`;
        for (let i = 0; i < N; i++) {
          const off = (i + (dy === 0 ? .5 : dy < 0 ? .2 : .75)) / N * dur;
          o += `<circle r="${dy === 0 ? 3 : 2.6}" fill="#fff" opacity="${dy === 0 ? .55 : .4}"><animateMotion dur="${dur.toFixed(2)}s" begin="-${off.toFixed(2)}s" repeatCount="indefinite"><mpath href="#${id}"/></animateMotion></circle>`;
        }
        o += '</g>';
      }
      return o;
    };
    const Tc = tv(T.czerpnia, 5), Tn = tv(T.nawiew, 20), Tw = tv(T.wywiew, 21), Tz = tv(T.wyrzutnia, 8);
    const OP = on ? FO : .2;
    /* wywiew (przecięcie z nawiewem/bypassem wycięte maską) */
    s += `<g${bypassOpen ? '' : ' mask="url(#xm)"'} opacity="${OP}">${pieces(SP_E, 0, SP_E.L, m => colorAt(sW, Tw + (Tz - Tw) * m / SP_E.L))}${parts('pe', flowW)}</g>`;
    const ghost = c.bypass_duct !== false;
    if (bypassOpen) {
      s += '<g mask="url(#em)">';
      s += `<g mask="url(#bm)" opacity="${on ? .14 : .08}">${pieces(SP_F, S_BR, S_JN, () => GREY)}</g>`;
      s += `<g opacity="${OP}">${pieces(SP_F, 0, S_BR, () => colorAt(sN, Tc))}${pieces(SP_B, 0, SP_B.L, () => colorAt(sN, Tc))}${pieces(SP_F, S_JN, SP_F.L, () => colorAt(sN, Tc))}${parts('pf', flowN)}</g>`;
      s += '</g>';
    } else {
      if (ghost) s += `<g opacity=".1">${pieces(SP_B, 0, SP_B.L, () => GREY)}</g>`;
      s += `<g opacity="${OP}">${pieces(SP_F, 0, SP_F.L, m => colorAt(sN, Tc + (Tn - Tc) * m / SP_F.L))}${parts('pf', flowN)}</g>`;
    }
    /* odzysk / bypass – plakietka */
    const eff = this._num('efficiency'), pw = this._num('recovered_power'), pu = this._unit('recovered_power') || 'W';
    const pwTxt = !isFinite(pw) ? '–' : (pu === 'W' ? (Math.abs(pw) >= 1000 ? (pw / 1000).toFixed(2) + ' kW' : Math.round(pw) + ' W') : f(pw, 1) + ' ' + pu);
    const acc = bypassOpen ? '#0b9b74' : t.on;
    s += `<g data-act="popup" data-v="sterowanie"><circle cx="401.5" cy="355.5" r="65" fill="none" stroke="${acc}" stroke-width="3" stroke-dasharray="9 9" opacity=".85"/><circle cx="401.5" cy="355.5" r="65" fill="transparent"/><circle cx="401.5" cy="355.5" r="52" fill="${t.panel}" stroke="${acc}" stroke-width="3.5"${pan}/>`;
    if (bypassOpen) {
      s += `<text x="401.5" y="353" text-anchor="middle" font-size="19" font-weight="700" fill="${t.text}">BYPASS</text><text x="401.5" y="371" text-anchor="middle" font-size="10" font-weight="700" letter-spacing="1" fill="${t.muted}">bez odzysku</text>`;
    } else {
      s += `<text x="401.5" y="338" text-anchor="middle" font-size="10" font-weight="700" letter-spacing="1.6" fill="${t.muted}">ODZYSK</text>
<text x="401.5" y="365" text-anchor="middle" font-size="30" font-weight="700" fill="${t.text}">${isFinite(eff) ? eff.toFixed(1) : '–'}<tspan font-size="17">%</tspan></text>
<text x="401.5" y="383" text-anchor="middle" font-size="12" font-weight="600" fill="${t.muted}">${pwTxt}</text>`;
    }
    s += '</g>';
    /* strzałki */
    const arrow = (tip, y, dir, color) => { const b = dir === 'r' ? tip - 18 : tip + 18; return `<polygon points="${b},${y - 11} ${tip},${y} ${b},${y + 11}" fill="${color}"/>`; };
    s += arrow(2, YT, 'r', col(sN, T.czerpnia)) + arrow(-16, YB, 'l', col(sW, T.wyrzutnia)) + arrow(804, YT, 'l', col(sW, T.wywiew)) + arrow(822, YB, 'r', col(sN, T.nawiew));
    /* kontury filtrów + króćce */
    if (!ph) for (const d of [FILT_L, FILT_R]) s += `<path d="${d}" fill="none" stroke="${t.filtLine}" stroke-width="${t.filtW}" stroke-linejoin="round" stroke-linecap="round"/>`;
    if (ph) s += `<image href="${esc(IM.path + IM.ducts)}" x="0" y="0" width="801" height="706"/>`;
    else for (const [x, y, w, h] of DUCTS) {
      s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="7" fill="${t.duct}"/>`;
      if (t.ductLine) for (const k of [1, 2, 3]) s += `<path d="M${x} ${y + k * h / 4}H${x + w}" stroke="${t.ductLine}" stroke-width="1"/>`;
    }
    /* kafelki w filtrach */
    const fchg = this._st('filter_change') ? parseFloat(this._st('filter_change').state) : 0;
    const tiles = [[133, 'NAWIEW', flowN, this._num('drive_nawiew'), colorAt(sN, tv(T.czerpnia, 5) + (tv(T.nawiew, 20) - tv(T.czerpnia, 5)) * 145 / 827)],
      [670, 'WYWIEW', flowW, this._num('drive_wywiew'), colorAt(sW, tv(T.wyrzutnia, 8) + (tv(T.wywiew, 21) - tv(T.wyrzutnia, 8)) * 682 / 827)]];
    for (const [cx, lab, fl, dr, bgc] of tiles) {
      const dk = !dark && lum(bgc) > .36, tc = dark ? '#cfd8e1' : (dk ? '#0d1b26' : '#ffffff'), pct = isFinite(dr) ? Math.max(0, Math.min(100, dr)) : 0;
      s += `<g${dk || dark ? '' : ' filter="url(#tsh)"'} data-act="more" data-v="${esc(E.filter_change || '')}">`;
      s += `<text x="${cx}" y="192" text-anchor="middle" font-size="10" font-weight="700" letter-spacing="1.3" fill="${tc}" fill-opacity=".8">${lab}</text>`;
      s += `<text x="${cx}" y="221" text-anchor="middle" font-size="24" font-weight="700" fill="${tc}">${isFinite(fl) ? Math.round(fl) : '–'}<tspan font-size="11" font-weight="600"> m³/h</tspan></text>`;
      s += `<text x="${cx}" y="243" text-anchor="middle" font-size="12" font-weight="700" fill="${tc}">${isFinite(dr) ? Math.round(dr) : '–'} %<tspan font-size="9.5" fill-opacity=".8" dx="5">wyster.</tspan></text>`;
      s += `<rect x="${cx - 30}" y="251" width="60" height="5" rx="2.5" fill="${tc}" fill-opacity=".28"/><rect x="${cx - 30}" y="251" width="${60 * pct / 100}" height="5" rx="2.5" fill="${tc}"/>`;
      s += `<text x="${cx}" y="273" text-anchor="middle" font-size="9.5" font-weight="700" letter-spacing=".9" fill="${tc}">${fchg > 0 ? 'WYMIEŃ FILTR' : 'FILTR OK'}</text></g>`;
    }
    /* temperatury */
    const temp = (x, y, label, v, color, anchor, key) => `<g data-act="more" data-v="${esc(E[key] || '')}"><text x="${x}" y="${y - 12}" text-anchor="${anchor}" font-size="14" font-weight="600" letter-spacing="1.5" fill="${t.muted}">${label}</text><text x="${x}" y="${y + 20}" text-anchor="${anchor}" font-size="30" font-weight="700" fill="${color}">${f(v)}<tspan font-size="17" font-weight="600">°C</tspan></text></g>`;
    s += temp(-30, YT, 'CZERPNIA', T.czerpnia, col(sN, T.czerpnia), 'end', 'temp_czerpnia') + temp(-30, YB, 'WYRZUTNIA', T.wyrzutnia, col(sW, T.wyrzutnia), 'end', 'temp_wyrzutnia');
    s += temp(842, YT, 'WYWIEW', T.wywiew, col(sW, T.wywiew), 'start', 'temp_wywiew') + temp(842, YB, 'NAWIEW', T.nawiew, col(sN, T.nawiew), 'start', 'temp_nawiew');
    /* FPX – napis w poprzek rury nawiewu (za lewym filtrem) */
    const fpx = this._st('fpx_mode'); const fpxOn = fpx && isFinite(parseFloat(fpx.state)) && parseFloat(fpx.state) !== 0;
    if (fpx) s += `<g data-act="more" data-v="${esc(E.fpx_mode || '')}"><text transform="translate(215.4,235.2) rotate(-66.6)" text-anchor="middle" dominant-baseline="central" font-size="38" font-weight="800" letter-spacing="3" fill="${fpxOn ? '#e8651a' : '#ffffff'}" fill-opacity="${fpxOn ? 1 : (dark ? .3 : .42)}"${fpxOn ? ' stroke="#ffffff" stroke-width="1.4" paint-order="stroke"' : ''}>FPX</text></g>`;
    const k = (this._cfg.font_scale > 0 ? this._cfg.font_scale : 1.2);
    return (s + '</svg>').replace(/font-size="([\d.]+)"/g, (m, v) => `font-size="${(parseFloat(v) < 13 ? parseFloat(v) * k : parseFloat(v)).toFixed(1)}"`);
  }
}
const SX = -90, SW = 650;

/* ------------------------------------------------------------------ edytor wizualny */
class TheslaGreenCardEditor extends HTMLElement {
  constructor() { super(); this.attachShadow({ mode: 'open' }); }
  setConfig(c) { this._cfg = JSON.parse(JSON.stringify(c || {})); this._build(); }
  set hass(h) { this._hass = h; this.shadowRoot.querySelectorAll('ha-form').forEach(f => f.hass = h); }
  _emit(cfg) { this._cfg = cfg; this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: cfg }, bubbles: true, composed: true })); }
  _tc(which) { const tc = this._cfg.temperature_colors || {}; return tc[which] || { preset: 'turbo' }; }
  _setTc(which, v) { const cfg = Object.assign({}, this._cfg); cfg.temperature_colors = Object.assign({}, cfg.temperature_colors || {}, { [which]: v }); this._emit(cfg); this._build(); }
  _build() {
    const r = this.shadowRoot; const cfg = this._cfg;
    const ent = Object.assign({}, DEFAULT_ENTITIES, cfg.entities || {});
    r.innerHTML = `<style>
      :host{display:block} details{border:1px solid var(--divider-color,#8884);border-radius:10px;margin:8px 0;padding:0 12px} summary{cursor:pointer;padding:12px 0;font-weight:600}
      .row{display:flex;gap:8px;align-items:center;margin:6px 0} .row input[type=number]{width:80px} .row input[type=text]{flex:1;min-width:0}
      input,select,button{font:inherit;padding:6px 8px;border-radius:8px;border:1px solid var(--divider-color,#8886);background:var(--card-background-color,#fff);color:var(--primary-text-color)}
      input[type=color]{padding:0;width:42px;height:34px} button{cursor:pointer} .bar{height:22px;border-radius:6px;margin:6px 0;border:1px solid var(--divider-color,#8884)}
      .sub{opacity:.7;font-size:12px;margin:4px 0 8px} h4{margin:14px 0 4px}
    </style>
    <ha-form id="gen"></ha-form>
    <details open><summary>Kolory temperatur</summary><div id="tc"></div></details>
    <details><summary>Encje</summary><div id="ents"></div></details>
    <details><summary>Tryby specjalne (przyciski w popupie)</summary><div id="modes"></div></details>`;
    const gen = r.getElementById('gen');
    gen.hass = this._hass;
    gen.schema = [{ name: 'theme', selector: { select: { mode: 'dropdown', options: [{ value: 'auto', label: 'Automatyczny (wg motywu HA)' }, { value: 'light', label: 'Jasny' }, { value: 'dark', label: 'Ciemny' }] } } }];
    gen.data = { theme: cfg.theme || 'auto' };
    gen.computeLabel = () => 'Motyw karty';
    gen.addEventListener('value-changed', e => { e.stopPropagation(); this._emit(Object.assign({}, this._cfg, { theme: e.detail.value.theme })); });
    /* kolory */
    const tcBox = r.getElementById('tc');
    for (const [which, title, sub] of [['nawiew', 'Strumień nawiewu', 'czerpnia → nawiew'], ['wywiew', 'Strumień wywiewu', 'wywiew → wyrzutnia']]) {
      const sc = this._tc(which); const st = stopsOf(sc);
      const wrap = document.createElement('div');
      wrap.innerHTML = `<h4>${title}</h4><div class="sub">${sub}</div>
        <div class="row"><select class="pre">${['turbo', 'hrv', 'custom'].map(p => `<option value="${p}" ${(sc.preset || 'turbo') === p ? 'selected' : ''}>${PRESET_LABELS[p]}</option>`).join('')}</select></div>
        <div class="bar" style="background:linear-gradient(90deg,${st.map(s => `${s[1]} ${((s[0] - st[0][0]) / ((st[st.length - 1][0] - st[0][0]) || 1) * 100).toFixed(1)}%`).join(',')})"></div>
        <div class="stops"></div>`;
      tcBox.appendChild(wrap);
      const pre = wrap.querySelector('.pre');
      pre.addEventListener('change', () => {
        const p = pre.value;
        if (p === 'custom') this._setTc(which, { preset: 'custom', stops: st.map(s => ({ temp: s[0], color: s[1] })) });
        else this._setTc(which, { preset: p });
      });
      const box = wrap.querySelector('.stops');
      if ((sc.preset || 'turbo') === 'custom') {
        const stops = (sc.stops || []).map(s => Object.assign({}, s));
        const commit = () => this._setTc(which, { preset: 'custom', stops });
        stops.forEach((s, i) => {
          const row = document.createElement('div'); row.className = 'row';
          row.innerHTML = `<input type="number" step="0.5" value="${s.temp}"> °C <input type="color" value="${s.color}"><button title="Usuń">✕</button>`;
          row.querySelector('input[type=number]').addEventListener('change', ev => { stops[i].temp = Number(ev.target.value); stops.sort((a, b) => a.temp - b.temp); commit(); });
          row.querySelector('input[type=color]').addEventListener('change', ev => { stops[i].color = ev.target.value; commit(); });
          row.querySelector('button').addEventListener('click', () => { if (stops.length > 2) { stops.splice(i, 1); commit(); } });
          box.appendChild(row);
        });
        const add = document.createElement('button'); add.textContent = '+ Dodaj przystanek';
        add.addEventListener('click', () => { const last = stops[stops.length - 1]; stops.push({ temp: (last ? last.temp : 20) + 5, color: last ? last.color : '#ff0000' }); commit(); });
        const reset = document.createElement('button'); reset.textContent = 'Przywróć domyślne'; reset.style.marginLeft = '8px';
        reset.addEventListener('click', () => this._setTc(which, { preset: 'turbo' }));
        box.append(add, reset);
      }
    }
    /* encje */
    const eb = r.getElementById('ents');
    for (const [title, keys] of ENTITY_GROUPS) {
      const h = document.createElement('h4'); h.textContent = title; eb.appendChild(h);
      const f = document.createElement('ha-form'); f.hass = this._hass;
      f.schema = keys.map(k => ({ name: k, selector: { entity: {} } }));
      f.data = Object.fromEntries(keys.map(k => [k, ent[k]]));
      f.computeLabel = s => ENTITY_LABELS[s.name] || s.name;
      f.addEventListener('value-changed', e => { e.stopPropagation(); const c2 = Object.assign({}, this._cfg); c2.entities = Object.assign({}, c2.entities || {}, e.detail.value); this._emit(c2); });
      eb.appendChild(f);
    }
    const fh = document.createElement('h4'); fh.textContent = 'Awarie (wszystkie z wartością ≠ 0 = AWARIA)'; eb.appendChild(fh);
    const ff = document.createElement('ha-form'); ff.hass = this._hass;
    ff.schema = [{ name: 'faults', selector: { entity: { multiple: true } } }]; ff.data = { faults: ent.faults };
    ff.computeLabel = () => 'Encje awarii';
    ff.addEventListener('value-changed', e => { e.stopPropagation(); const c2 = Object.assign({}, this._cfg); c2.entities = Object.assign({}, c2.entities || {}, { faults: e.detail.value.faults }); this._emit(c2); });
    eb.appendChild(ff);
    /* tryby specjalne */
    const mb = r.getElementById('modes');
    const modes = (Array.isArray(cfg.special_modes) && cfg.special_modes.length ? cfg.special_modes : DEFAULT_MODES).map(m => JSON.parse(JSON.stringify(m)));
    const mc = () => { const c2 = Object.assign({}, this._cfg, { special_modes: modes }); this._emit(c2); };
    mb.innerHTML = '<div class="sub">Nazwa · wartość stanu encji „tryb specjalny” oznaczająca ten tryb · usługa (np. modbus.write_register lub select.select_option) · dane (JSON)</div>';
    modes.forEach((m, i) => {
      const row = document.createElement('div'); row.className = 'row'; row.style.flexWrap = 'wrap';
      row.innerHTML = `<input type="text" class="n" placeholder="Nazwa" value="${esc(m.name || '')}" style="flex:1 1 120px"><input type="text" class="v" placeholder="stan" value="${esc(m.value ?? '')}" style="flex:0 0 70px"><input type="text" class="s" placeholder="domena.usługa" value="${esc(m.service || '')}" style="flex:1 1 170px"><input type="text" class="d" placeholder='{"entity_id":"…"}' value="${esc(JSON.stringify(m.data || {}))}" style="flex:2 1 260px"><button>✕</button>`;
      row.querySelector('.n').addEventListener('change', e => { modes[i].name = e.target.value; mc(); });
      row.querySelector('.v').addEventListener('change', e => { modes[i].value = e.target.value; mc(); });
      row.querySelector('.s').addEventListener('change', e => { modes[i].service = e.target.value; mc(); });
      row.querySelector('.d').addEventListener('change', e => { try { modes[i].data = JSON.parse(e.target.value || '{}'); e.target.style.outline = ''; mc(); } catch (_) { e.target.style.outline = '2px solid #e5484d'; } });
      row.querySelector('button').addEventListener('click', () => { modes.splice(i, 1); mc(); this._build(); });
      mb.appendChild(row);
    });
    const ad = document.createElement('button'); ad.textContent = '+ Dodaj tryb';
    ad.addEventListener('click', () => { modes.push({ name: 'Nowy', value: '', service: '', data: {} }); mc(); this._build(); });
    mb.appendChild(ad);
  }
}

if (!customElements.get('theslagreen-card')) customElements.define('theslagreen-card', TheslaGreenCard);
if (!customElements.get('theslagreen-card-editor')) customElements.define('theslagreen-card-editor', TheslaGreenCardEditor);
window.customCards = window.customCards || [];
if (!window.customCards.find(c => c.type === 'theslagreen-card')) window.customCards.push({ type: 'theslagreen-card', name: 'Rekuperacja Thessla Green', description: 'Karta rekuperatora AirPack4h: animowane przepływy, kolory wg temperatury, popupy, jasny/ciemny motyw.', preview: false });
console.info('%c THESLAGREEN-CARD %c v' + VERSION, 'background:#2f80ed;color:#fff;font-weight:700;padding:2px 6px;border-radius:4px 0 0 4px', 'background:#222;color:#fff;padding:2px 6px;border-radius:0 4px 4px 0');
})();
