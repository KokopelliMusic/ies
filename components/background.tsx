export function Background({ bgColor = '#001220', fgColor = '#80b' }) {
  return <svg id="visual" viewBox="0 0 1920 1080" width="1920" height="1080" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1">
    <rect x="0" y="0" width="1920" height="1080" fill={bgColor}></rect>
    <g fill={fgColor}>
      <circle r="289" cx="1352" cy="533"></circle>
      <circle r="127" cx="388" cy="559"></circle>
      <circle r="153" cx="1804" cy="116"></circle>
      <circle r="178" cx="841" cy="75"></circle>
      <circle r="272" cx="864" cy="987"></circle>
      <circle r="249" cx="1716" cy="1035"></circle>
    </g>
  </svg>
}