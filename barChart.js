const dataStack1 = {
  data: [
    [160, 950, 300, 40, 25],
    [160, 950, 400, 50, 36],
    [160, 950, 500, 60, 47],
    [160, 950, 600, 70, 58],
    [160, 950, 700, 80, 69],
    [160, 950, 700, 80, 110]
  ],
  colours: ['LightPink', 'Pink', 'HotPink', 'PaleVioletRed', 'Orchid'],
  labels: ['October', 'November', 'December', 'January', 'February', 'March'],
  labelColours: ['Black', 'Black', 'black', 'black', 'black', 'black'],
  legend: ['utilities', 'rent', 'food', 'gas', 'clothes'],
  yAxisLabel: 'Monthly Spending',
  title: 'My Monthly Expenses'
}
const dataStack2 = {
  data: [
    [21, 56, 87, 77],
    [16, 63, 88, 90],
    [44, 45, 97, 97],
    [32, 54, 99, 70],
    [35, 52, 109, 85]
  ],
  colours: ['#cc3300', '#ff9900', '#cc9900', '#999966'],
  labels: ['2015', '2016', '2017', '2018', '2019'],
  labelColours: ['Black', 'Black', 'black', 'black', 'black', 'black'],
  legend: ['Transportation', 'Fuel burning', 'Industrial', 'Agriculture'],
  yAxisLabel: 'Metric Tons of Pollution in Victoria',
  title: 'Pollution in Victoria BC By Year'
}
const dataStack3 = {
  data: [
    [3400, 60, 100],
    [4900, 95, 200],
    [5600, 85, 300]
  ],
  colours: ['#6666ff', '#3333ff', '#0033cc'],
  labels: ['1990-2000', '2000-2010', '2010-2020'],
  labelColours: ['Black', 'Black', 'black'],
  legend: ['Cow Meat', 'Lab Grown Meat', 'Plant Based Meat'],
  yAxisLabel: 'Gallons of Water Used',
  title: 'Amount of Water Used by Animal Meat vs Plant Based Alternatives'
}
const dataStack4 = {
  data: [
    [16, 9, 3, 4, 22],
    [32, 20, 14, 5, 34],
    [44, 31, 25, 6, 48],
    [68, 53, 36, 17, 65],
    [90, 65, 47, 18, 86],
    [113, 79, 57, 28, 126]
  ],
  colours: ['#99ffcc', '#ff9933', '#ff66cc', '#9900ff', '#73e600'],
  labels: ['2010', '2011', '2012', '2013', '2014', '2015'],
  labelColours: ['Black', 'Black', 'black', 'black', 'black', 'black'],
  legend: ['Web Developer', 'Software Developer', 'Data Analysist', 'Systems Architect', 'Software Engineer'],
  yAxisLabel: 'Lighthouse Labs Student Professions',
  title: 'Job Titles of Lighthouse Labs Graduates'
}

function drawBarChart (dataStack, options, element) {
  const ctx = element.getContext('2d')
  element.width = options.width
  element.height = options.height

  // drawBars(data, options, element, ctx, dataLabels);

  // drawAxis(data, options, element, ctx);
  drawTitle(dataStack, element, ctx)

  drawStackedBars(dataStack, options, element, ctx)
}

function drawStackedBars (dataStack, options, element, ctx) {
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'center'
  const textPosition = checkTextPos(options.textPos)
  const maxVals = []
  let maxVal = 0

  for (let i = 0; i < dataStack.data.length; i++) {
    maxVal = 0
    for (const num of dataStack.data[i]) {
      maxVal += num
    }
    maxVals.push(maxVal)
  }
  maxVal = largestVal(maxVals)
  const constant = options.innerHeight() / maxVal
  let barSpace

  if (options.barSpace === 'default') {
    barSpace = options.innerWidth() / dataStack.data.length / 2
  } else {
    barSpace = options.barSpace
  }
  const barWidth = options.innerWidth() / dataStack.data.length - barSpace
  drawAxis(maxVals, options, element, ctx, dataStack, barSpace)
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'center'

  let previousHeight = 0
  for (let i = 0; i < dataStack.data.length; i++) {
    previousHeight = 0
    for (let j = 0; j < dataStack.data[i].length; j++) {
      ctx.fillStyle = dataStack.colours[j]
      ctx.fillRect(i * (barWidth + barSpace) + (options.xGap() + 10), element.height - options.yGap() - previousHeight, barWidth, -dataStack.data[i][j] * constant)
      ctx.fillStyle = dataStack.labelColours[i]
      if (options.displayValues) {
        ctx.fillText(dataStack.data[i][j].toString(), i * (barWidth + barSpace) + (options.xGap()) + barWidth / 2 + 10, element.height - previousHeight - dataStack.data[i][j] * constant * textPosition - options.yGap() + options.bump())
      }

      previousHeight += dataStack.data[i][j] * constant
    }

    ctx.fillText(dataStack.labels[i], i * (barWidth + barSpace) + (options.xGap()) + barWidth / 2 + 10, element.height - options.yGap() + 20)
    if (options.displayTotals) {
      ctx.fillText(maxVals[i], i * (barWidth + barSpace) + (options.xGap()) + barWidth / 2 + 10, element.height - options.yGap() - previousHeight - 10)
    }
  }
  drawLegend(dataStack, options, ctx, element)
}

function drawLegend (dataStack, options, ctx, element) {
  ctx.textBaseline = 'right'
  ctx.textAlign = 'left'
  let barSpace
  if (options.barSpace === 'default') {
    barSpace = options.innerWidth() / dataStack.data.length / 2
  } else {
    barSpace = options.barSpace
  }
  if (dataStack.legend[0]) {
    ctx.font = options.valueSize + 'px ' + options.valueFont
    for (let i = 0; i < dataStack.legend.length; i++) {
      ctx.fillStyle = dataStack.colours[dataStack.legend.length - 1 - i]
      ctx.fillRect(options.width - options.xGap() + 30 - barSpace, i * 20 + options.yGap(), 10, 10)
      ctx.fillStyle = options.textColour
      ctx.fillText(dataStack.legend[dataStack.legend.length - 1 - i], options.width - options.xGap() + 50 - barSpace, i * 20 + options.yGap() + 5)
    }
  }
}

function drawTitle (dataStack, element, ctx) {
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'center'
  ctx.font = options.titleSize + 'px ' + options.titleFont
  ctx.fillText(dataStack.title, element.width / 2, 20)
}
/*
function drawBars (data, options, element, ctx, dataLabels) {
  const textPosition = checkTextPos(options.textPos)
  const maxVal = largestVal(data)
  const constant = options.innerHeight() / maxVal
  let barSpace
  if (options.barSpace === 'default') {
    barSpace = options.innerWidth() / data.length / 2
  } else {
    barSpace = options.barSpace
  }
  const barWidth = options.innerWidth() / data.length - barSpace

  ctx.textBaseline = 'middle'
  ctx.textAlign = 'center'

  for (let i = 0; i < data.length; i++) {
    ctx.fillStyle = options.fillColour
    ctx.fillRect(i * (barWidth + barSpace) + (options.xGap()) + barSpace, element.height - options.yGap(), barWidth, -data[i] * constant)
    ctx.fillStyle = options.textColour
    ctx.fillText(data[i].toString(), i * (barWidth + barSpace) + (options.xGap()) + barWidth / 2 + barSpace, element.height - data[i] * constant * textPosition - options.yGap() - options.bump())
    ctx.fillText(dataLabels[i], i * (barWidth + barSpace) + (options.xGap()) + barWidth / 2 + barSpace, element.height - options.yGap() + 20)
  }
}
*/
function drawAxis (data, options, element, ctx, dataStack, barSpace) {
  ctx.textAlign = 'right'
  ctx.textBaseline = 'left'
  ctx.fillStyle = options.textColour
  const maxVal = largestVal(data)
  let yPos
  ctx.font = options.valueSize + 'px ' + options.valueFont
  for (let i = options.axisNums; i >= 0; i--) {
    yPos = (element.height - (options.yGap() + options.innerHeight() * i * 10 / options.axisNums * 0.1))
    ctx.fillText((maxVal * i * 10 / options.axisNums * 0.1).toFixed(1).toString(), options.xGap(), yPos)
    if (options.displayGrid) {
      ctx.beginPath()
      ctx.moveTo(options.xGap(), yPos)
      ctx.lineTo(options.width - options.xGap() - barSpace, yPos)
      ctx.lineWidth = 0.1
      ctx.stroke()
    }
  }
  ctx.save()
  ctx.font = options.titleSize + 'px ' + options.titleFont
  ctx.translate(options.xGap() / 2, options.height / 2)
  ctx.rotate(-Math.PI / 2)
  ctx.textAlign = 'center'
  ctx.fillText(dataStack.yAxisLabel, 0, -5)
  ctx.restore()
}

function largestVal (data) {
  let largest = 0
  for (const d of data) {
    if (d > largest) {
      largest = d
    }
  }
  return largest
}
function checkTextPos (pos) {
  let textPosition = 0
  if (pos === 'top') {
    textPosition = 1
  }
  if (pos === 'middle') {
    textPosition = 0.5
  }
  if (pos === 'bottom') {
    textPosition = 0
  }
  return textPosition
}

function addChart (dataStack, options, element, ctx) {

}

const options = {
  width: 700,
  height: 300,
  barSpace: 'default',
  textPos: 'middle',
  fillColour: 'Pink',
  textColour: 'Black',
  widthMultiplier: 0.6,
  heightMultiplier: 0.8,
  axisNums: 5,
  displayTotals: true,
  displayValues: true,
  displayGrid: true,
  titleSize: '14',
  titleFont: 'Arial',
  valueSize: '10',
  valueFont: 'Arial',

  bump: function () {
    if (this.textPos === 'top') {
      return 5
    } else if (this.textPos === 'bottom') {
      return -5
    } else {
      return 0
    }
  },
  innerWidth: function () {
    return this.width * this.widthMultiplier
  },
  innerHeight: function () {
    return this.height * this.heightMultiplier
  },
  xGap: function () {
    return (this.width - this.innerWidth()) / 2
  },
  yGap: function () {
    return (this.height - this.innerHeight()) / 2
  }
}
