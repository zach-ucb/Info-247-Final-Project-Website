function _1(md){return(
md`# Final Project Charts`
)}

function _hibpBreaches(FileAttachment){return(
FileAttachment("Have I Been Pwned — All Breaches.json").json()
)}

function _marketItems(){return(
[
  {nameLines: ["Name"], inProfile: true, priceDescription: "< $0.01", priceOnScale: 2},
  {nameLines: ["Home Address"], inProfile: true, priceDescription: "< $0.01", priceOnScale: 2},
  {nameLines: ["Email Address"], inProfile: true, priceDescription: "< $0.02", priceOnScale: 2},
  {nameLines: ["Phone Number"], inProfile: true, priceDescription: "< $0.02", priceOnScale: 2},
  {nameLines: ["SSN"], inProfile: true, priceDescription: "$1", priceOnScale: 4},
  {nameLines: ["Social Media", "Login"], priceDescription: "$40", priceOnScale: 40},
  {nameLines: ["Bank Login"], priceDescription: "$45", priceOnScale: 45},
  {nameLines: ["Credit Card"], priceDescription: "$50", priceOnScale: 50},
  {nameLines: ["Email Login"], priceDescription: "$65", priceOnScale: 65},
  {nameLines: ["Combined", "Profile"], inProfile: true, priceDescription: "$1,000",
   priceOnScale: 1000}
]
)}

function _combinedProfileItem(marketItems){return(
marketItems[marketItems.length - 1]
)}

function _combinedProfileItemIndex(marketItems){return(
marketItems.length - 1
)}

function _6(html){return(
html`
<h2 style="color: #241267; font-family: -apple-system, system-ui, sans-serif; font-size: 30px">
  Average Information Prices on the Dark Web
</h2>
`
)}

function _7(html){return(
html`
<h4 style="color: #4521c4; font-family: -apple-system, system-ui, sans-serif;">
  Click to see what happens when you combine all of the low-value personal information...
</h4>
`
)}

function _combineButtonWasClicked(Inputs){return(
Inputs.button("Combine", {
  value: false,
  reduce: ((currentValue) => {
    return !currentValue
  })
})
)}

function _infoPricesAnimatedChart(width,marketItems,combinedProfileItem,d3,combinedProfileItemIndex,combineButtonWasClicked)
{

  
  const height = 700
  const margins = {top: 20, bottom: 20, left: 34, right: 20}
  const contentWidth = (width - margins.left - margins.right)
  const contentHeight = (height - margins.top - margins.bottom)

  
  const marketItemsBefore = marketItems.filter(item => (item != combinedProfileItem))
  const inMarketItemsBefore = (item => (marketItemsBefore.indexOf(item) >= 0))

  
  const barY = d3.scaleBand()
    .domain(d3.range(marketItems.length))
    .range([0, contentHeight])
    .paddingOuter(0.5)
    .paddingInner(0.2)

  const barXBefore = d3.scaleLinear()
    .domain([
      0,
      d3.max(marketItems, (item => item.priceOnScale)) * 1.2
    ])
    .range([0, contentWidth])

  const barXAfter = d3.scaleLinear()
    .domain([
      0,
      d3.max(marketItems, (item => item.priceOnScale)) * 1.2
    ])
    .range([0, contentWidth])

  
  const containerDiv = d3.create("div")
    .style("font-family", "-apple-system, system-ui, sans-serif")
  
  const svg = (
    containerDiv.append("svg")
      .attr("width", width)
      .attr("height", height)
  )

  const svgContent = (
    svg.append("g")
      .attr("transform", `translate(${margins.left}, ${margins.top})`)
      .append("g")
  )

  
  function xAxis(scale) {
    return d3.axisBottom(scale)
      .tickFormat(d3.format("$,"))
  }

  function yAxis(scale) {
    return d3.axisLeft(scale)
      .tickValues(d => "")
  }
  
  const xAxisGroup = (
    svgContent.append("g")
      .attr("transform", `translate(0, ${contentHeight})`)
      .style("font-family", "-apple-system, system-ui, sans-serif")
      .style("font-size", "13px")
  )
  xAxisGroup.call(xAxis(barXBefore))

  const yAxisGroup = (
    svgContent.append("g")
  )
  yAxisGroup.call(yAxis(barY))


  const bars = (
    svgContent.append("g")
      .selectAll("rect")
      .data(marketItems)
      .join("rect")
      .attr("x", 0)
      .attr("y", ((item, index) => barY(index)))
      .attr("height", barY.bandwidth())
      .attr("fill", (item => ((item.inProfile) ? "#2e1683" : "#5e3bde")))
  )
  bars.filter(inMarketItemsBefore)
    .attr("width", (item => barXBefore(item.priceOnScale)))

  
  const textSize = 14
  const barLabelOffset = 14
  
  
  const profileBoxGroup = svgContent.append("g")
  
  const profileBoxHeight = 100
  const profileBoxX = (barXAfter(combinedProfileItem.priceOnScale) + barLabelOffset)
  const profileBoxY = (barY(combinedProfileItemIndex) + (barY.bandwidth() * 1.42) - profileBoxHeight)
  const profileBox = (
    profileBoxGroup.append("rect")
      .attr("x", profileBoxX)
      .attr("y", profileBoxY)
      .attr("width", (barY.bandwidth() * 2.7))
      .attr("height", profileBoxHeight)
      .attr("rx", 14)
      .attr("ry", 14)
      .attr("fill", "#ede8ff")
      .attr("opacity", 0)
      .style("visibility", "hidden")
  )

  const profileBoxNameLabel = (
    profileBoxGroup.append("text")
      .text(combinedProfileItem.nameLines.join(" "))
      .attr("x", profileBoxX)
      .attr("y", (profileBoxY - (textSize * 2) - 6))
      .attr("font-weight", 600)
      .attr("fill", "#241267")
      .attr("opacity", 0)
      .style("visibility", "hidden")
  )

  const profileBoxPriceLabel = (
    profileBoxGroup.append("text")
      .text(combinedProfileItem.priceDescription)
      .attr("x", profileBoxX)
      .attr("y", (profileBoxY - (textSize - 2)))
      .attr("font-weight", 500)
      .attr("fill", "#603dde")
      .attr("opacity", 0)
      .style("visibility", "hidden")
  )

  const barNameLabels = (
    svgContent.append("g")
      .selectAll("text")
      .data(marketItemsBefore)
      .join("text")
      .text(item => item.nameLines.join(" "))
      .attr("x", ((item, index) => (barXBefore(item.priceOnScale) + barLabelOffset)))
      .attr("y", ((item, index) => (barY(index) + (barY.bandwidth() / 2) - 4)))
      .attr("font-size", textSize)
      .attr("font-weight", 600)
      .attr("fill", "#241267")
  )

  const barPriceLabels = (
    svgContent.append("g")
      .selectAll("text")
      .data(marketItemsBefore)
      .join("text")
      .text(item => item.priceDescription)
      .attr("x", ((item, index) => barXBefore(item.priceOnScale) + barLabelOffset))
      .attr("y", ((item, index) => barY(index) + (barY.bandwidth() / 2) + textSize))
      .attr("font-size", textSize)
      .attr("fill", "#603dde")
  )

  
  function standardTransition(selection) {
    return selection
      .transition()
      .duration(1500)
      .ease(d3.easeCubic)
  }
  
  if (combineButtonWasClicked) {
    // standardTransition(xAxisGroup)
    //   .call(d3.axisBottom(barXAfter))
    // standardTransition(bars.filter(inMarketItemsBefore))
    //   .attr("width", (item => barXAfter(item.priceOnScale)))
    // standardTransition(barNameLabels)
    //   .attr("x", (item => barXAfter(item.priceOnScale) + barLabelOffset))
    // standardTransition(barPriceLabels)
    //   .attr("x", (item => barXAfter(item.priceOnScale) + barLabelOffset))
    // .on("end", (() => {
      standardTransition(barNameLabels.filter(item => item.inProfile))
        .delay(200)
        .attr("x", (profileBoxX + 12))
        .attr("y", ((item, index) => ((profileBoxY + 23) + (index * (textSize + 2)))))
      standardTransition(barPriceLabels.filter(item => item.inProfile))
        .delay(200)
        .attr("opacity", 0)
      .on("end", (() => {
        standardTransition(profileBox)
          .duration(1000)
          .attr("opacity", 1)
          .style("visibility", "visible")
        .on("end", (() => {
          standardTransition(bars)
            .attr("width", (item => barXAfter(item.priceOnScale)))
          .on("end", (() => {
            standardTransition(profileBoxNameLabel)
              .attr("opacity", 1)
              .style("visibility", "visible")
            standardTransition(profileBoxPriceLabel)
              .attr("opacity", 1)
              .style("visibility", "visible")
          }))
        }))
      }))
    // }))
  }

  
  return containerDiv.node()

  
}


function _yearOfBreachAsInt(d3)
{
  const breachYearParser = d3.timeParse("%Y-%m-%d")
  return (breach => breachYearParser(breach["BreachDate"]).getFullYear())
}


function _percentOfBreachesMatching(hibpBreaches,yearOfBreachAsInt){return(
function percentOfBreachesMatching(predicate, year) {
  const totalBreachesInYear = hibpBreaches.filter(breach => ((yearOfBreachAsInt(breach) == year)))
  const matchingBreachesInYear = totalBreachesInYear.filter(predicate)
  return (parseFloat(matchingBreachesInYear.length) / parseFloat(totalBreachesInYear.length))
}
)}

function _namesLineChart(width,d3,percentOfBreachesMatching)
{

  const height = 300
  const margins = {top: 20, bottom: 20, left: 46, right: 20}
  const contentWidth = (width - margins.left - margins.right)
  const contentHeight = (height - margins.top - margins.bottom)


  const domain = d3.range(2011, 2021 + 1)
  const range = domain.map(year => percentOfBreachesMatching((breach => (breach.DataClasses.indexOf("Names") > 0)), year))

  
  const xScale = d3.scaleLinear()
    .domain([domain[0], domain[domain.length - 1]])
    .range([0, contentWidth])

  const yScale = d3.scaleLinear()
    .domain([0, 1])
    .range([contentHeight, 0])

  
  const containerDiv = d3.create("div")
    .style("font-family", "-apple-system, system-ui, sans-serif")
  
  const svg = (
    containerDiv.append("svg")
      .attr("width", width)
      .attr("height", height)
  )

  const svgContent = (
    svg.append("g")
      .attr("transform", `translate(${margins.left}, ${margins.top})`)
      .append("g")
  )

  
  function xAxis(scale) {
    return d3.axisBottom(scale)
      .ticks(6)
      .tickFormat(d3.format(new d3.FormatSpecifier({comma: false})))
  }

  function yAxis(scale) {
    return d3.axisLeft(scale)
      .ticks(4)
      .tickFormat(d3.format(".0%"))
  }
  
  const xAxisGroup = (
    svgContent.append("g")
      .attr("transform", `translate(0, ${contentHeight})`)
      .style("font-family", "-apple-system, system-ui, sans-serif")
      .style("font-size", "13px")
  )
  xAxisGroup.call(xAxis(xScale))

  const yAxisGroup = (
    svgContent.append("g")
    .style("font-family", "-apple-system, system-ui, sans-serif")
    .style("font-size", "13px")
  )
  yAxisGroup.call(yAxis(yScale))


  svgContent.append("path")
    .datum(domain)
    .attr("fill", "none")
    .attr("stroke", "#603dde")
    .attr("stroke-width", 6)
    .attr("d", d3.line()
      .x(year => xScale(year))
      .y((year, index) => yScale(range[index]))
    )

  
  return containerDiv.node()
  
}


function _homeAddressesLineChart(width,d3,percentOfBreachesMatching)
{

  const height = 300
  const margins = {top: 20, bottom: 20, left: 46, right: 20}
  const contentWidth = (width - margins.left - margins.right)
  const contentHeight = (height - margins.top - margins.bottom)


  const domain = d3.range(2011, 2021 + 1)
  const range = domain.map(year => percentOfBreachesMatching((breach => (breach.DataClasses.indexOf("Physical addresses") > 0)), year))

  
  const xScale = d3.scaleLinear()
    .domain([domain[0], domain[domain.length - 1]])
    .range([0, contentWidth])

  const yScale = d3.scaleLinear()
    .domain([0, 1])
    .range([contentHeight, 0])

  
  const containerDiv = d3.create("div")
    .style("font-family", "-apple-system, system-ui, sans-serif")
  
  const svg = (
    containerDiv.append("svg")
      .attr("width", width)
      .attr("height", height)
  )

  const svgContent = (
    svg.append("g")
      .attr("transform", `translate(${margins.left}, ${margins.top})`)
      .append("g")
  )

  
  function xAxis(scale) {
    return d3.axisBottom(scale)
      .ticks(6)
      .tickFormat(d3.format(new d3.FormatSpecifier({comma: false})))
  }

  function yAxis(scale) {
    return d3.axisLeft(scale)
      .ticks(4)
      .tickFormat(d3.format(".0%"))
  }
  
  const xAxisGroup = (
    svgContent.append("g")
      .attr("transform", `translate(0, ${contentHeight})`)
      .style("font-family", "-apple-system, system-ui, sans-serif")
      .style("font-size", "13px")
  )
  xAxisGroup.call(xAxis(xScale))

  const yAxisGroup = (
    svgContent.append("g")
    .style("font-family", "-apple-system, system-ui, sans-serif")
    .style("font-size", "13px")
  )
  yAxisGroup.call(yAxis(yScale))


  svgContent.append("path")
    .datum(domain)
    .attr("fill", "none")
    .attr("stroke", "#603dde")
    .attr("stroke-width", 6)
    .attr("d", d3.line()
      .x(year => xScale(year))
      .y((year, index) => yScale(range[index]))
    )

  
  return containerDiv.node()
  
}


function _phoneNumbersLineChart(width,d3,percentOfBreachesMatching)
{

  const height = 300
  const margins = {top: 20, bottom: 20, left: 46, right: 20}
  const contentWidth = (width - margins.left - margins.right)
  const contentHeight = (height - margins.top - margins.bottom)


  const domain = d3.range(2011, 2021 + 1)
  const range = domain.map(year => percentOfBreachesMatching((breach => (breach.DataClasses.indexOf("Phone numbers") > 0)), year))

  
  const xScale = d3.scaleLinear()
    .domain([domain[0], domain[domain.length - 1]])
    .range([0, contentWidth])

  const yScale = d3.scaleLinear()
    .domain([0, 1])
    .range([contentHeight, 0])

  
  const containerDiv = d3.create("div")
    .style("font-family", "-apple-system, system-ui, sans-serif")
  
  const svg = (
    containerDiv.append("svg")
      .attr("width", width)
      .attr("height", height)
  )

  const svgContent = (
    svg.append("g")
      .attr("transform", `translate(${margins.left}, ${margins.top})`)
      .append("g")
  )

  
  function xAxis(scale) {
    return d3.axisBottom(scale)
      .ticks(6)
      .tickFormat(d3.format(new d3.FormatSpecifier({comma: false})))
  }

  function yAxis(scale) {
    return d3.axisLeft(scale)
      .ticks(4)
      .tickFormat(d3.format(".0%"))
  }
  
  const xAxisGroup = (
    svgContent.append("g")
      .attr("transform", `translate(0, ${contentHeight})`)
      .style("font-family", "-apple-system, system-ui, sans-serif")
      .style("font-size", "13px")
  )
  xAxisGroup.call(xAxis(xScale))

  const yAxisGroup = (
    svgContent.append("g")
    .style("font-family", "-apple-system, system-ui, sans-serif")
    .style("font-size", "13px")
  )
  yAxisGroup.call(yAxis(yScale))


  svgContent.append("path")
    .datum(domain)
    .attr("fill", "none")
    .attr("stroke", "#603dde")
    .attr("stroke-width", 6)
    .attr("d", d3.line()
      .x(year => xScale(year))
      .y((year, index) => yScale(range[index]))
    )

  
  return containerDiv.node()
  
}


function _passwordsLineChart(width,d3,percentOfBreachesMatching)
{

  const height = 300
  const margins = {top: 20, bottom: 20, left: 46, right: 20}
  const contentWidth = (width - margins.left - margins.right)
  const contentHeight = (height - margins.top - margins.bottom)


  const domain = d3.range(2011, 2021 + 1)
  const range = domain.map(year => percentOfBreachesMatching((breach => (breach.DataClasses.indexOf("Passwords") > 0)), year))

  
  const xScale = d3.scaleLinear()
    .domain([domain[0], domain[domain.length - 1]])
    .range([0, contentWidth])

  const yScale = d3.scaleLinear()
    .domain([0, 1])
    .range([contentHeight, 0])

  
  const containerDiv = d3.create("div")
    .style("font-family", "-apple-system, system-ui, sans-serif")
  
  const svg = (
    containerDiv.append("svg")
      .attr("width", width)
      .attr("height", height)
  )

  const svgContent = (
    svg.append("g")
      .attr("transform", `translate(${margins.left}, ${margins.top})`)
      .append("g")
  )

  
  function xAxis(scale) {
    return d3.axisBottom(scale)
      .ticks(6)
      .tickFormat(d3.format(new d3.FormatSpecifier({comma: false})))
  }

  function yAxis(scale) {
    return d3.axisLeft(scale)
      .ticks(4)
      .tickFormat(d3.format(".0%"))
  }
  
  const xAxisGroup = (
    svgContent.append("g")
      .attr("transform", `translate(0, ${contentHeight})`)
      .style("font-family", "-apple-system, system-ui, sans-serif")
      .style("font-size", "13px")
  )
  xAxisGroup.call(xAxis(xScale))

  const yAxisGroup = (
    svgContent.append("g")
    .style("font-family", "-apple-system, system-ui, sans-serif")
    .style("font-size", "13px")
  )
  yAxisGroup.call(yAxis(yScale))


  svgContent.append("path")
    .datum(domain)
    .attr("fill", "none")
    .attr("stroke", "#603dde")
    .attr("stroke-width", 6)
    .attr("d", d3.line()
      .x(year => xScale(year))
      .y((year, index) => yScale(range[index]))
    )

  
  return containerDiv.node()
  
}


function _prcBreaches(FileAttachment){return(
FileAttachment("Privacy Rights Clearinghouse Data Breach Database.csv").csv()
)}

function _prcBreachesGrouped(d3,prcBreaches){return(
d3.group(prcBreaches, (breach => breach["Type of organization"]))
)}

function _yearOfPRCBreachAsInt(d3)
{
  const breachYearParser = d3.timeParse("%m/%d/%Y")
  return (breach => breachYearParser(breach["Date Made Public"]).getFullYear())
}


function _prcBreachesInYearWhere(prcBreaches,yearOfPRCBreachAsInt){return(
function prcBreachesInYearWhere(predicate, year) {
  return prcBreaches.filter(breach => ((predicate(breach)) && (yearOfPRCBreachAsInt(breach) == year)))
}
)}

function _educationalInstitutionsLineChart(width,d3,prcBreachesInYearWhere)
{

  
  const height = 300
  const margins = {top: 20, bottom: 20, left: 42, right: 20}
  const contentWidth = (width - margins.left - margins.right)
  const contentHeight = (height - margins.top - margins.bottom)


  const domain = d3.range(2005, 2017 + 1)
  const range = domain.map(year => prcBreachesInYearWhere((breach => (breach["Type of organization"] == "EDU")), year).length)

  
  const xScale = d3.scaleLinear()
    .domain([domain[0], domain[domain.length - 1]])
    .range([0, contentWidth])

  const yScale = d3.scaleLinear()
    .domain([0, 175])
    .range([contentHeight, 0])

  
  const containerDiv = d3.create("div")
    .style("font-family", "-apple-system, system-ui, sans-serif")
  
  const svg = (
    containerDiv.append("svg")
      .attr("width", width)
      .attr("height", height)
  )

  const svgContent = (
    svg.append("g")
      .attr("transform", `translate(${margins.left}, ${margins.top})`)
      .append("g")
  )

  
  function xAxis(scale) {
    return d3.axisBottom(scale)
      .ticks(6)
      .tickFormat(d3.format(new d3.FormatSpecifier({comma: false})))
  }

  function yAxis(scale) {
    return d3.axisLeft(scale)
      .ticks(4)
  }
  
  const xAxisGroup = (
    svgContent.append("g")
      .attr("transform", `translate(0, ${contentHeight})`)
      .style("font-family", "-apple-system, system-ui, sans-serif")
      .style("font-size", "13px")
  )
  xAxisGroup.call(xAxis(xScale))

  const yAxisGroup = (
    svgContent.append("g")
    .style("font-family", "-apple-system, system-ui, sans-serif")
    .style("font-size", "13px")
  )
  yAxisGroup.call(yAxis(yScale))


  svgContent.append("path")
    .datum(domain)
    .attr("fill", "none")
    .attr("stroke", "#603dde")
    .attr("stroke-width", 6)
    .attr("d", d3.line()
      .x(year => xScale(year))
      .y((year, index) => yScale(range[index]))
    )

  
  return containerDiv.node()

  
}


function _governmentsLineChart(width,d3,prcBreachesInYearWhere)
{

  
  const height = 300
  const margins = {top: 20, bottom: 20, left: 42, right: 20}
  const contentWidth = (width - margins.left - margins.right)
  const contentHeight = (height - margins.top - margins.bottom)


  const domain = d3.range(2005, 2017 + 1)
  const range = domain.map(year => prcBreachesInYearWhere((breach => (breach["Type of organization"] == "GOV")), year).length)

  
  const xScale = d3.scaleLinear()
    .domain([domain[0], domain[domain.length - 1]])
    .range([0, contentWidth])

  const yScale = d3.scaleLinear()
    .domain([0, 175])
    .range([contentHeight, 0])

  
  const containerDiv = d3.create("div")
    .style("font-family", "-apple-system, system-ui, sans-serif")
  
  const svg = (
    containerDiv.append("svg")
      .attr("width", width)
      .attr("height", height)
  )

  const svgContent = (
    svg.append("g")
      .attr("transform", `translate(${margins.left}, ${margins.top})`)
      .append("g")
  )

  
  function xAxis(scale) {
    return d3.axisBottom(scale)
      .ticks(6)
      .tickFormat(d3.format(new d3.FormatSpecifier({comma: false})))
  }

  function yAxis(scale) {
    return d3.axisLeft(scale)
      .ticks(4)
  }
  
  const xAxisGroup = (
    svgContent.append("g")
      .attr("transform", `translate(0, ${contentHeight})`)
      .style("font-family", "-apple-system, system-ui, sans-serif")
      .style("font-size", "13px")
  )
  xAxisGroup.call(xAxis(xScale))

  const yAxisGroup = (
    svgContent.append("g")
    .style("font-family", "-apple-system, system-ui, sans-serif")
    .style("font-size", "13px")
  )
  yAxisGroup.call(yAxis(yScale))


  svgContent.append("path")
    .datum(domain)
    .attr("fill", "none")
    .attr("stroke", "#603dde")
    .attr("stroke-width", 6)
    .attr("d", d3.line()
      .x(year => xScale(year))
      .y((year, index) => yScale(range[index]))
    )

  
  return containerDiv.node()

  
}


function _retailersLineChart(width,d3,prcBreachesInYearWhere)
{

  
  const height = 300
  const margins = {top: 20, bottom: 20, left: 42, right: 20}
  const contentWidth = (width - margins.left - margins.right)
  const contentHeight = (height - margins.top - margins.bottom)


  const domain = d3.range(2005, 2017 + 1)
  const range = domain.map(year => prcBreachesInYearWhere((breach => (breach["Type of organization"] == "BSR")), year).length)

  
  const xScale = d3.scaleLinear()
    .domain([domain[0], domain[domain.length - 1]])
    .range([0, contentWidth])

  const yScale = d3.scaleLinear()
    .domain([0, 175])
    .range([contentHeight, 0])

  
  const containerDiv = d3.create("div")
    .style("font-family", "-apple-system, system-ui, sans-serif")
  
  const svg = (
    containerDiv.append("svg")
      .attr("width", width)
      .attr("height", height)
  )

  const svgContent = (
    svg.append("g")
      .attr("transform", `translate(${margins.left}, ${margins.top})`)
      .append("g")
  )

  
  function xAxis(scale) {
    return d3.axisBottom(scale)
      .ticks(6)
      .tickFormat(d3.format(new d3.FormatSpecifier({comma: false})))
  }

  function yAxis(scale) {
    return d3.axisLeft(scale)
      .ticks(4)
  }
  
  const xAxisGroup = (
    svgContent.append("g")
      .attr("transform", `translate(0, ${contentHeight})`)
      .style("font-family", "-apple-system, system-ui, sans-serif")
      .style("font-size", "13px")
  )
  xAxisGroup.call(xAxis(xScale))

  const yAxisGroup = (
    svgContent.append("g")
    .style("font-family", "-apple-system, system-ui, sans-serif")
    .style("font-size", "13px")
  )
  yAxisGroup.call(yAxis(yScale))


  svgContent.append("path")
    .datum(domain)
    .attr("fill", "none")
    .attr("stroke", "#603dde")
    .attr("stroke-width", 6)
    .attr("d", d3.line()
      .x(year => xScale(year))
      .y((year, index) => yScale(range[index]))
    )

  
  return containerDiv.node()

  
}


function _financialInsuranceBusinessesLineChart(width,d3,prcBreachesInYearWhere)
{

  
  const height = 300
  const margins = {top: 20, bottom: 20, left: 42, right: 20}
  const contentWidth = (width - margins.left - margins.right)
  const contentHeight = (height - margins.top - margins.bottom)


  const domain = d3.range(2005, 2017 + 1)
  const range = domain.map(year => prcBreachesInYearWhere((breach => (breach["Type of organization"] == "BSF")), year).length)

  
  const xScale = d3.scaleLinear()
    .domain([domain[0], domain[domain.length - 1]])
    .range([0, contentWidth])

  const yScale = d3.scaleLinear()
    .domain([0, 175])
    .range([contentHeight, 0])

  
  const containerDiv = d3.create("div")
    .style("font-family", "-apple-system, system-ui, sans-serif")
  
  const svg = (
    containerDiv.append("svg")
      .attr("width", width)
      .attr("height", height)
  )

  const svgContent = (
    svg.append("g")
      .attr("transform", `translate(${margins.left}, ${margins.top})`)
      .append("g")
  )

  
  function xAxis(scale) {
    return d3.axisBottom(scale)
      .ticks(6)
      .tickFormat(d3.format(new d3.FormatSpecifier({comma: false})))
  }

  function yAxis(scale) {
    return d3.axisLeft(scale)
      .ticks(4)
  }
  
  const xAxisGroup = (
    svgContent.append("g")
      .attr("transform", `translate(0, ${contentHeight})`)
      .style("font-family", "-apple-system, system-ui, sans-serif")
      .style("font-size", "13px")
  )
  xAxisGroup.call(xAxis(xScale))

  const yAxisGroup = (
    svgContent.append("g")
    .style("font-family", "-apple-system, system-ui, sans-serif")
    .style("font-size", "13px")
  )
  yAxisGroup.call(yAxis(yScale))


  svgContent.append("path")
    .datum(domain)
    .attr("fill", "none")
    .attr("stroke", "#603dde")
    .attr("stroke-width", 6)
    .attr("d", d3.line()
      .x(year => xScale(year))
      .y((year, index) => yScale(range[index]))
    )

  
  return containerDiv.node()

  
}


function _otherBusinessesLineChart(width,d3,prcBreachesInYearWhere)
{

  
  const height = 300
  const margins = {top: 20, bottom: 20, left: 42, right: 20}
  const contentWidth = (width - margins.left - margins.right)
  const contentHeight = (height - margins.top - margins.bottom)


  const domain = d3.range(2005, 2017 + 1)
  const range = domain.map(year => prcBreachesInYearWhere((breach => (breach["Type of organization"] == "BSO")), year).length)

  
  const xScale = d3.scaleLinear()
    .domain([domain[0], domain[domain.length - 1]])
    .range([0, contentWidth])

  const yScale = d3.scaleLinear()
    .domain([0, 175])
    .range([contentHeight, 0])

  
  const containerDiv = d3.create("div")
    .style("font-family", "-apple-system, system-ui, sans-serif")
  
  const svg = (
    containerDiv.append("svg")
      .attr("width", width)
      .attr("height", height)
  )

  const svgContent = (
    svg.append("g")
      .attr("transform", `translate(${margins.left}, ${margins.top})`)
      .append("g")
  )

  
  function xAxis(scale) {
    return d3.axisBottom(scale)
      .ticks(6)
      .tickFormat(d3.format(new d3.FormatSpecifier({comma: false})))
  }

  function yAxis(scale) {
    return d3.axisLeft(scale)
      .ticks(4)
  }
  
  const xAxisGroup = (
    svgContent.append("g")
      .attr("transform", `translate(0, ${contentHeight})`)
      .style("font-family", "-apple-system, system-ui, sans-serif")
      .style("font-size", "13px")
  )
  xAxisGroup.call(xAxis(xScale))

  const yAxisGroup = (
    svgContent.append("g")
    .style("font-family", "-apple-system, system-ui, sans-serif")
    .style("font-size", "13px")
  )
  yAxisGroup.call(yAxis(yScale))


  svgContent.append("path")
    .datum(domain)
    .attr("fill", "none")
    .attr("stroke", "#603dde")
    .attr("stroke-width", 6)
    .attr("d", d3.line()
      .x(year => xScale(year))
      .y((year, index) => yScale(range[index]))
    )

  
  return containerDiv.node()

  
}


function _healthcareProvidersLineChart(width,d3,prcBreachesInYearWhere)
{

  
  const height = 300
  const margins = {top: 20, bottom: 20, left: 42, right: 20}
  const contentWidth = (width - margins.left - margins.right)
  const contentHeight = (height - margins.top - margins.bottom)


  const domain = d3.range(2005, 2017 + 1)
  const range = domain.map(year => prcBreachesInYearWhere((breach => (breach["Type of organization"] == "MED")), year).length)

  
  const xScale = d3.scaleLinear()
    .domain([domain[0], domain[domain.length - 1]])
    .range([0, contentWidth])

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(range)])
    .range([contentHeight, 0])

  
  const containerDiv = d3.create("div")
    .style("font-family", "-apple-system, system-ui, sans-serif")
  
  const svg = (
    containerDiv.append("svg")
      .attr("width", width)
      .attr("height", height)
  )

  const svgContent = (
    svg.append("g")
      .attr("transform", `translate(${margins.left}, ${margins.top})`)
      .append("g")
  )

  
  function xAxis(scale) {
    return d3.axisBottom(scale)
      .ticks(6)
      .tickFormat(d3.format(new d3.FormatSpecifier({comma: false})))
  }

  function yAxis(scale) {
    return d3.axisLeft(scale)
      .ticks(4)
  }
  
  const xAxisGroup = (
    svgContent.append("g")
      .attr("transform", `translate(0, ${contentHeight})`)
      .style("font-family", "-apple-system, system-ui, sans-serif")
      .style("font-size", "13px")
  )
  xAxisGroup.call(xAxis(xScale))

  const yAxisGroup = (
    svgContent.append("g")
    .style("font-family", "-apple-system, system-ui, sans-serif")
    .style("font-size", "13px")
  )
  yAxisGroup.call(yAxis(yScale))


  svgContent.append("path")
    .datum(domain)
    .attr("fill", "none")
    .attr("stroke", "#603dde")
    .attr("stroke-width", 6)
    .attr("d", d3.line()
      .x(year => xScale(year))
      .y((year, index) => yScale(range[index]))
    )

  
  return containerDiv.node()

  
}


export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["Have I Been Pwned — All Breaches.json", {url: new URL("./files/fd3adfd0a04f8a8178e7f7d86d22dfbc12660ca95dd98155ce0bd51fc93291ae8a8f470d86889d0dbe688537ca125fda3069e6a465e0526e9c93a13fdf7561cd", import.meta.url), mimeType: "application/json", toString}],
    ["Privacy Rights Clearinghouse Data Breach Database.csv", {url: new URL("./files/f5696edc6cfb75d25c12c88410c2075c098bda86b8e9f7d07b1df4bc8817670e834f75ee33269215863e9501a5e03a7fe75a0db1da7bca2b2029defb747beef4", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("hibpBreaches")).define("hibpBreaches", ["FileAttachment"], _hibpBreaches);
  main.variable(observer("marketItems")).define("marketItems", _marketItems);
  main.variable(observer("combinedProfileItem")).define("combinedProfileItem", ["marketItems"], _combinedProfileItem);
  main.variable(observer("combinedProfileItemIndex")).define("combinedProfileItemIndex", ["marketItems"], _combinedProfileItemIndex);
  main.variable(observer()).define(["html"], _6);
  main.variable(observer()).define(["html"], _7);
  main.variable(observer("viewof combineButtonWasClicked")).define("viewof combineButtonWasClicked", ["Inputs"], _combineButtonWasClicked);
  main.variable(observer("combineButtonWasClicked")).define("combineButtonWasClicked", ["Generators", "viewof combineButtonWasClicked"], (G, _) => G.input(_));
  main.variable(observer("infoPricesAnimatedChart")).define("infoPricesAnimatedChart", ["width","marketItems","combinedProfileItem","d3","combinedProfileItemIndex","combineButtonWasClicked"], _infoPricesAnimatedChart);
  main.variable(observer("yearOfBreachAsInt")).define("yearOfBreachAsInt", ["d3"], _yearOfBreachAsInt);
  main.variable(observer("percentOfBreachesMatching")).define("percentOfBreachesMatching", ["hibpBreaches","yearOfBreachAsInt"], _percentOfBreachesMatching);
  main.variable(observer("namesLineChart")).define("namesLineChart", ["width","d3","percentOfBreachesMatching"], _namesLineChart);
  main.variable(observer("homeAddressesLineChart")).define("homeAddressesLineChart", ["width","d3","percentOfBreachesMatching"], _homeAddressesLineChart);
  main.variable(observer("phoneNumbersLineChart")).define("phoneNumbersLineChart", ["width","d3","percentOfBreachesMatching"], _phoneNumbersLineChart);
  main.variable(observer("passwordsLineChart")).define("passwordsLineChart", ["width","d3","percentOfBreachesMatching"], _passwordsLineChart);
  main.variable(observer("prcBreaches")).define("prcBreaches", ["FileAttachment"], _prcBreaches);
  main.variable(observer("prcBreachesGrouped")).define("prcBreachesGrouped", ["d3","prcBreaches"], _prcBreachesGrouped);
  main.variable(observer("yearOfPRCBreachAsInt")).define("yearOfPRCBreachAsInt", ["d3"], _yearOfPRCBreachAsInt);
  main.variable(observer("prcBreachesInYearWhere")).define("prcBreachesInYearWhere", ["prcBreaches","yearOfPRCBreachAsInt"], _prcBreachesInYearWhere);
  main.variable(observer("educationalInstitutionsLineChart")).define("educationalInstitutionsLineChart", ["width","d3","prcBreachesInYearWhere"], _educationalInstitutionsLineChart);
  main.variable(observer("governmentsLineChart")).define("governmentsLineChart", ["width","d3","prcBreachesInYearWhere"], _governmentsLineChart);
  main.variable(observer("retailersLineChart")).define("retailersLineChart", ["width","d3","prcBreachesInYearWhere"], _retailersLineChart);
  main.variable(observer("financialInsuranceBusinessesLineChart")).define("financialInsuranceBusinessesLineChart", ["width","d3","prcBreachesInYearWhere"], _financialInsuranceBusinessesLineChart);
  main.variable(observer("otherBusinessesLineChart")).define("otherBusinessesLineChart", ["width","d3","prcBreachesInYearWhere"], _otherBusinessesLineChart);
  main.variable(observer("healthcareProvidersLineChart")).define("healthcareProvidersLineChart", ["width","d3","prcBreachesInYearWhere"], _healthcareProvidersLineChart);
  return main;
}
