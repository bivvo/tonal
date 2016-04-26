import { encode, asList, transpose } from 'tonal'

/**
 * A regex to match roman numbers literals with the from:
 * `[accidentals]roman[element]` where:
 *
 * accidentals: (Optional) one or two flats (b) or shaprs (#)
 * roman: (Required) a roman numeral from I to VII either in upper or lower case
 * element: (Optional) a name of an element
 *
 * @name roman.regex
 *
 * @example
 * r.exec('bVII')
 * r.exec('IVMaj7')
 * r.exec('ii minor')
 */
const ROMAN = /^\s*(b|bb|#|##|)(IV|III|II|I|VII|VI|V|iv|iii|ii|i|vii|vi|v)\s*(.*)\s*$/
export const romanRegex = () => ROMAN

var NUM = {i: 0, ii: 1, iii: 2, iv: 3, v: 4, vi: 5, vii: 6}

/**
 * Parse a chord expressed with roman numerals. It returns an interval representing
 * the root of the chord relative to the key tonic and the chord name.
 *
 * @param {String} str - the roman numeral string
 * @return {Object} the roman number in array notation or null if not valid numeral
 *
 * @example
 * var parse = require('music-notation/roman.parse')
 * parse('V7') // => { root: ['tnl', 1, 0, 0, 1], name: '7'}
 * parse('bIIalt') // => [ root: ['tnl', -5, 0, 2, 1], name: 'alt']
 */
function parseRomanChord (str) {
  var m = ROMAN.exec(str)
  if (!m) return null
  var num = NUM[m[2].toLowerCase()]
  var alt = m[1].length
  if (m[1][0] === 'b') alt = -alt
  return { root: encode(num, alt, 0, 1), name: m[3] }
}

/**
 * Get chord progression from a tonic and chord in roman numerals
 *
 * @param {String} tonic - the tonic
 * @param {Array|String} progression - the progression in roman numerals
 * @return {Array} the chord progression
 *
 * @example
 * var progression = require('chord-progression')
 * progression('I IIm7 V7', 'C') // => ['C', 'Dm7', 'G7']
 */
export function progression (chords, tonic) {
  return asList(chords).map((e) => {
    const r = parseRomanChord(e)
    return r ? transpose(r.root, tonic) + r.name : null
  })
}