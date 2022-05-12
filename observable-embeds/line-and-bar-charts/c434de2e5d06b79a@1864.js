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
  {nameLines: ["Cryptocurrency", "Exchange Login"], priceDescription: "$200", priceOnScale: 200},
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
  

  function createBarNameLabels(parentGroup, marketItems) {
    return (
      parentGroup
        .selectAll("text")
        .data(marketItems)
        .join("text")
        .text(item => item.nameLines.join(" "))
        .attr("x", ((item, index) => (barXBefore(item.priceOnScale) + barLabelOffset)))
        .attr("y", ((item, index) => (barY(index) + (barY.bandwidth() / 2) - 4)))
        .attr("font-size", textSize)
        .attr("font-weight", 600)
        .attr("fill", "#241267")
    )
  }

  const barNameLabels = createBarNameLabels(
    svgContent.append("g"),
    marketItemsBefore
  )
  
  const movingBarNameLabelCopies = createBarNameLabels(
    svgContent.append("g"),
    marketItemsBefore.filter(item => item.inProfile)
  )
  .attr("visibility", "hidden")
  

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
  
  const infoCard = containerDiv.append("div")
    .style("visibility", "hidden")
    .style("position", "absolute")
    .attr("transform", `translate(${margins.left}, ${margins.top})`)
    .style("max-width", "400px")
    .style("padding", "20px")
    .style("border-radius", "20px")
    .style("font-size", "12px")
    .style("background-color", "#d0c3ff")

  const infoCardContent = (
    infoCard.append("div")
  )

  const previousStepButton = (
    infoCard.append("button")
      .text("Back")
      .style("font-size", "14px")
      .on("click", (clickEvent => {
        currentStepIndex -= 1
        moveToCurrentStep()
      }))
  )
  
  const nextStepButton = (
    infoCard.append("button")
      .text("Next")
      .style("font-size", "14px")
      .on("click", (clickEvent => {
        currentStepIndex += 1
        moveToCurrentStep()
      }))
  )

  const infoCardLine = svgContent.append("line")
    .style("stroke", "#aaa")
    .style("stroke-width", "2")
  
  const infoCardSteps = [
    {
      itemIndex: 2,
      itemLabelWidth: 91,
      caption: "<strong>Email addresses</strong> are sold in bulk for less than $0.00001 a piece, because they are only useful for spamming and marketing.",
      icon: ""
    },
    {
      itemIndex: 8,
      itemLabelWidth: 73,
      caption: "<strong>Email logins</strong> are sold for around $65 — these are valuable because they can be used to reset your passwords and gain access to lots of other services.",
      icon: ""
    },
    {
      itemIndex: 9,
      itemLabelWidth: 205,
      caption: "<strong>PayPal and cryptocurrency exchange logins</strong> sell for $100–$500, because the funds in those accounts can be withdrawn immediately.",
      icon: ""
    },
    {
      itemIndex: 4,
      itemLabelWidth: 149,
      caption: "Your <strong>social security number</strong> by itself will sell for only $1-2. But see just how much more valuable it gets when it’s combined with your name, mailing address, and phone number:",
      icon: ""
    }
  ]

  var currentStepIndex = 0

  function infoCardContentsForStep(step) {
    var contents = ""
    contents += '<p style="font-size: 16px">' + step.caption + '</p>'
    return contents
  }

  function moveToCurrentStep() {
    if (currentStepIndex >= infoCardSteps.length) {
      infoCard
        .transition()
        .duration(200)
        .ease(d3.easeCubic)
        .style("opacity", 0)
        .style("visibility", "hidden")
      infoCardLine
        .transition()
        .duration(200)
        .ease(d3.easeCubic)
        .style("opacity", 0)
        .style("visibility", "hidden")
      movingBarNameLabelCopies
        .transition()
        .delay(195)
        .attr("visibility", "visible")
      standardTransition(movingBarNameLabelCopies)
        .delay(200)
        .attr("x", (profileBoxX + 12))
        .attr("y", ((item, index) => ((profileBoxY + 23) + (index * (textSize + 2)))))
      // standardTransition(barPriceLabels.filter(item => item.inProfile))
      //   .delay(200)
      //   .attr("opacity", 0)
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
      return
    }
    const step = infoCardSteps[currentStepIndex]
    const item = marketItems[step.itemIndex]
    const lineX1 = (barXBefore(item.priceOnScale) + barLabelOffset + step.itemLabelWidth + 20)
    const lineY1 = (barY(step.itemIndex) + (barY.bandwidth() / 2))
    const lineX2 = lineX1 + 100
    const lineY2 = lineY1 - 60
    infoCardLine
      .transition()
      .duration(400)
      .ease(d3.easeCubic)
      .attr("x1", lineX1)
      .attr("y1", lineY1)
      .attr("x2", lineX2)
      .attr("y2", lineY2)
    infoCard
      .transition()
      .duration(400)
      .ease(d3.easeCubic)
      .style("visibility", "visible")
      .style("top", `${lineY2 - 50}px`)
      .style("left", `${lineX2 + 20}px`)
      .on("end", (() => {
        infoCardContent
          .html(infoCardContentsForStep(step))
        previousStepButton
          .attr("disabled", ((currentStepIndex == 0) ? "true" : null))
        nextStepButton
          .text((currentStepIndex == (infoCardSteps.length - 1)) ? "Combine" : "Next")
      }))
  }

  moveToCurrentStep()

  
  function standardTransition(selection) {
    return selection
      .transition()
      .duration(1500)
      .ease(d3.easeCubic)
  }
  
  if (combineButtonWasClicked) {
      
  }

  
  return containerDiv.node()

  
}


function _prcBreaches(FileAttachment){return(
FileAttachment("Privacy Rights Clearinghouse Data Breach Database.csv").csv()
)}

function _yearOfPRCBreachAsInt(d3)
{
  const breachYearParser = d3.timeParse("%m/%d/%Y")
  return (breach => breachYearParser(breach["Date Made Public"]).getFullYear())
}


function _prcYearsDomain(d3){return(
d3.range(2005, 2017 + 1)
)}

function _organizationTypeCodes(){return(
new Map([
  ["Financial Businesses", "BSF"],
  ["Retail Businesses", "BSR"],
  ["Other Businesses", "BSO"],
  ["Educational Institutions", "EDU"],
  ["Governments and Militaries", "GOV"],
  ["Healthcare Providers", "MED"],
  ["Non-Profits", "NGO"]
])
)}

function _prcBreachesInYearForOrganizationType(prcBreaches,yearOfPRCBreachAsInt){return(
function prcBreachesInYearForOrganizationType(year, organizationTypeCode) {
  return prcBreaches.filter(breach => (
    (yearOfPRCBreachAsInt(breach) == year)
    && (breach["Type of organization"] == organizationTypeCode)
  )).length
}
)}

function _organizationTypeLines(organizationTypes,organizationTypeCodes,prcYearsDomain,relativeNumberOfBreaches){return(
organizationTypes.map(organizationType => {
  let organizationTypeCode = organizationTypeCodes.get(organizationType)
  return prcYearsDomain.map(year => relativeNumberOfBreaches(year, organizationTypeCode))
})
)}

function _organizationTypes(organizationTypeCodes){return(
Array.from(organizationTypeCodes.keys())
)}

function _relativeNumberOfBreaches(prcBreachesInYearForOrganizationType){return(
function relativeNumberOfBreaches(year, organizationTypeCode) {
  return (
    parseFloat(prcBreachesInYearForOrganizationType(year, organizationTypeCode))
    / parseFloat(prcBreachesInYearForOrganizationType(2005, organizationTypeCode))
  )
}
)}

function _breachTargetsChart(width,d3,prcYearsDomain,organizationTypeLines,organizationTypes)
{


  const height = 480
  const margins = {top: 20, bottom: 20, left: 42, right: 20}
  const contentWidth = (width - margins.left - margins.right)
  const contentHeight = (height - margins.top - margins.bottom)

  const lineLabelsWidth = 230

  const xScale = d3.scaleLinear()
    .domain([prcYearsDomain[0], prcYearsDomain[prcYearsDomain.length - 1]])
    .range([0, (contentWidth - lineLabelsWidth)])

  xScale.range

  const yScale = d3.scaleLog()
    .domain([d3.min(organizationTypeLines.flat()), d3.max(organizationTypeLines.flat())])
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

  
  svgContent.append("g")
    .selectAll("text")
    .data(["Number of breaches", "relative to 2005"])
    .join("text")
      .text(text => text)
      .attr("x", 8)
      .attr("y", ((text, index) => (10 + (index * 16))))
      .style("font-size", "13px")

  
  function xAxis(scale) {
    return d3.axisBottom(scale)
      .ticks(6)
      .tickFormat(d3.format(new d3.FormatSpecifier({comma: false})))
  }

  function yAxis(scale) {
    return d3.axisLeft(scale)
      .tickValues([1, 2, 3, 4, 10, 20, 30, 40])
      .tickFormat(n => `${n}×`)
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


  const lineColors = new Map([
    [5, "#603dde"],
    [2, "#1a9a5c"],
    [0, "#c4b421"],
    [1, "#d7372f"],
    [3, "#3890e0"],
    [4, "#d64b91"],
    [6, "#e18a0b"]
  ])

  const defaultHighlightedLineIndices = [5, 2]
  
  const defaultLineColor = "black"
  const defaultLineOpacity = 0.08
  const defaultLabelOpacity = 0.2


  const organizationTypeGroups = (
    svgContent.append("g")
      .selectAll("g")
      .data(organizationTypeLines)
      .join("g")
      .attr("d-index", ((line, index) => index))
      .attr("d-highlighted", ((line, index) => (defaultHighlightedLineIndices.indexOf(index) >= 0)))
  )


  function darkenLineAndLabel(element) {
    const organizationTypeGroup = d3.select(element.parentNode)
    if (organizationTypeGroup.attr("d-highlighted") == "true") {
      return
    }
    const path = organizationTypeGroup.select("path")
    const lineLabel = organizationTypeGroup.select("text")
    path
      .transition()
      .duration(40)
      .ease(d3.easeCubic)
      .attr("stroke", (line => {
        const index = parseInt(organizationTypeGroup.attr("d-index"))
        return lineColors.get(index)
      }))
      .attr("opacity", "0.3")
    lineLabel
      .transition()
      .duration(40)
      .ease(d3.easeCubic)
      .attr("fill", (line => {
        const index = parseInt(organizationTypeGroup.attr("d-index"))
        return lineColors.get(index)
      }))
      .attr("opacity", "0.77")
  }

  function resetLineAndLabel(element) {
    const organizationTypeGroup = d3.select(element.parentNode)
    if (organizationTypeGroup.attr("d-highlighted") == "true") {
      return
    }
    const path = organizationTypeGroup.select("path")
    const lineLabel = organizationTypeGroup.select("text")
    path
      .transition()
      .duration(40)
      .ease(d3.easeCubic)
      .attr("stroke", defaultLineColor)
      .attr("opacity", defaultLineOpacity)
    lineLabel
      .transition()
      .duration(40)
      .ease(d3.easeCubic)
      .attr("fill", defaultLineColor)
      .attr("opacity", defaultLabelOpacity)
  }

  function toggleLineAndLabelHighlight(element) {
    const organizationTypeGroup = d3.select(element.parentNode)
    const path = organizationTypeGroup.select("path")
    const lineLabel = organizationTypeGroup.select("text")
    if (organizationTypeGroup.attr("d-highlighted") == "false") {
      darkenLineAndLabel(element)
      organizationTypeGroup.attr("d-highlighted", "true")
      path
        .transition()
        .duration(40)
        .ease(d3.easeCubic)
        .attr("stroke", (line => {
          const index = parseInt(organizationTypeGroup.attr("d-index"))
          return lineColors.get(index)
        }))
        .attr("opacity", 1)
      lineLabel
        .transition()
        .duration(40)
        .ease(d3.easeCubic)
        .attr("fill", (line => {
          const index = parseInt(organizationTypeGroup.attr("d-index"))
          return lineColors.get(index)
        }))
        .attr("opacity", 1)
    }
    else {
      organizationTypeGroup.attr("d-highlighted", "false")
      resetLineAndLabel(element)
    }
  }

  
  organizationTypeGroups.append("path")
    .attr("d", d3.line()
      .x((point, index) => xScale(prcYearsDomain[index]))
      .y((point, index) => yScale(point))
    )
    .attr("fill", "none")
    .attr("stroke", ((line, index) => (
      ((defaultHighlightedLineIndices.indexOf(index) >= 0) ? lineColors.get(index) : defaultLineColor)
    )))
    .attr("stroke-width", 7)
    .attr("opacity", ((line, index) => (
      ((defaultHighlightedLineIndices.indexOf(index) >= 0) ? 1 : defaultLineOpacity)
    )))
    .on("mouseover", (mouseoverEvent => {
      darkenLineAndLabel(mouseoverEvent.srcElement)
    }))
    .on("mouseout", (mouseoutEvent => {
      resetLineAndLabel(mouseoutEvent.srcElement)
    }))
    .on("click", (clickEvent => {
      toggleLineAndLabelHighlight(clickEvent.srcElement)
    }))
    .style("cursor", "pointer")

  
  organizationTypeGroups.append("text")
    .text((line, index) => organizationTypes[index])
    .attr("x", ((contentWidth - lineLabelsWidth) + 20))
    .attr("y", (line => yScale(line[line.length - 1]) + 5))
    .attr("fill", ((line, index) => (
      ((defaultHighlightedLineIndices.indexOf(index) >= 0) ? lineColors.get(index) : defaultLineColor)
    )))
    .attr("opacity", ((line, index) => (
      ((defaultHighlightedLineIndices.indexOf(index) >= 0) ? 1 : defaultLabelOpacity)
    )))
    .on("mouseover", (mouseoverEvent => {
      darkenLineAndLabel(mouseoverEvent.srcElement)
    }))
    .on("mouseout", (mouseoutEvent => {
      resetLineAndLabel(mouseoutEvent.srcElement)
    }))
    .on("click", (clickEvent => {
      toggleLineAndLabelHighlight(clickEvent.srcElement)
    }))
    .style("cursor", "pointer")


  return containerDiv.node()

  
}


function _prcNonHealthcareBreachesInYear(prcBreaches,yearOfPRCBreachAsInt){return(
function prcNonHealthcareBreachesInYear(year) {
  return prcBreaches.filter(breach => (
    (yearOfPRCBreachAsInt(breach) == year)
    && (breach["Type of organization"] != "MED")
  )).length
}
)}

function _prcPercentOfNonHealthcareBreachesInYearForMethodType(prcBreaches,yearOfPRCBreachAsInt){return(
function prcPercentOfNonHealthcareBreachesInYearForMethodType(year, methodTypeCode) {
  const allNonHealthcareBreaches = prcBreaches.filter(breach => (
    (yearOfPRCBreachAsInt(breach) == year)
    && (breach["Type of organization"] != "MED")
  ))
  return (
    allNonHealthcareBreaches.filter(breach => (breach["Type of breach"] == methodTypeCode)).length
    / allNonHealthcareBreaches.length
  )
}
)}

function _yearPercentsBarChart(width,d3){return(
function yearPercentsBarChart(yearsDomain, percentOfBreachesForYear, chartColor, axisLabel) {
  

  const height = 182
  const margins = {top: 30, bottom: 20, left: 44, right: 20}
  const contentWidth = (width - margins.left - margins.right)
  const contentHeight = (height - margins.top - margins.bottom)

  
  const barX = d3.scaleBand()
    .domain(yearsDomain)
    .range([0, contentWidth])
    .paddingOuter(0.2)
    .paddingInner(0.14)

  const barY = d3.scaleLinear()
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


  svg.append("g")
    .selectAll("text")
    .data([axisLabel])
    .join("text")
      .text(text => text)
      .attr("x", (margins.left + 12))
      .attr("y", ((text, index) => (14 + (index * 16))))
      .attr("fill", "#747474")
      .style("font-size", "13px")

  
  function xAxis(scale) {
    return d3.axisBottom(scale)
      .tickSize(0)
      .tickPadding(8)
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
  xAxisGroup.call(xAxis(barX))
    .call(xAxisGroup => xAxisGroup.select(".domain").remove())

  const yAxisGroup = (
    svgContent.append("g")
    .style("font-family", "-apple-system, system-ui, sans-serif")
    .style("font-size", "13px")
  )
  yAxisGroup.call(yAxis(barY))
    .call(yAxisGroup => yAxisGroup.select(".domain").remove())


  function setPercentageLabelVisibility(yearGroup, newVisibility) {
    const percentageLabel = yearGroup.select("text")
    percentageLabel
      .transition()
      .duration(120)
      .ease(d3.easeCubic)
      .attr("opacity", ((newVisibility == "visible") ? 1 : 0))
      .attr("visibility", newVisibility)
  }
  
  
  const yearGroups = (
    svgContent.append("g")
      .selectAll("g")
      .data(yearsDomain)
      .join("g")
        .attr("transform", (year => `translate(${barX(year)}, 0)`))
        .on("mouseover", (mouseoverEvent => {
          const yearGroup = d3.select(mouseoverEvent.srcElement.parentNode)
          setPercentageLabelVisibility(yearGroup, "visible")
        }))
        .on("mouseout", (mouseoutEvent => {
          const yearGroup = d3.select(mouseoutEvent.srcElement.parentNode)
          setPercentageLabelVisibility(yearGroup, "hidden")
        }))
  )

  const barCornerRadius = 4

  const backgroundWholeBars = (
    yearGroups.append("rect")
      .attr("y", 0)
      .attr("width", barX.bandwidth())
      .attr("height", contentHeight)
      .attr("fill", chartColor)
      .attr("opacity", 0.28)
      .attr("rx", barCornerRadius)
  )

  const yearPercentageBars = (
    yearGroups.append("rect")
      .attr("y", (year => barY(percentOfBreachesForYear(year))))
      .attr("width", barX.bandwidth())
      .attr("height", (year => (
        (contentHeight - barY(percentOfBreachesForYear(year)))
      )))
      .attr("fill", chartColor)
      .attr("rx", barCornerRadius)
  )

  const percentageLabels = (
    yearGroups.append("text")
      .text(year => d3.format(".0%")(percentOfBreachesForYear(year)))
      .attr("x", (barX.bandwidth() / 2))
      .attr("y", (year => (barY(percentOfBreachesForYear(year)) - 10)))
      .attr("text-anchor", "middle")
      .attr("font-size", "16px")
      .attr("fill", chartColor)
      .attr("visibility", "hidden")
  )
  

  return containerDiv.node()

  
}
)}

function _hackBreachesBarChart(yearPercentsBarChart,prcYearsDomain,prcPercentOfNonHealthcareBreachesInYearForMethodType){return(
yearPercentsBarChart(prcYearsDomain, (year => (
  prcPercentOfNonHealthcareBreachesInYearForMethodType(year, "HACK")
)), "#603dde", "Percent of breaches caused by hacks")
)}

function _accidentalDisclosureBreachesBarChart(yearPercentsBarChart,prcYearsDomain,prcPercentOfNonHealthcareBreachesInYearForMethodType){return(
yearPercentsBarChart(prcYearsDomain, (year => (
  prcPercentOfNonHealthcareBreachesInYearForMethodType(year, "DISC")
)), "#1a9a5c", "Percent of breaches caused by accidents")
)}

function _portableDeviceLossBreachesBarChart(yearPercentsBarChart,prcYearsDomain,prcPercentOfNonHealthcareBreachesInYearForMethodType){return(
yearPercentsBarChart(prcYearsDomain, (year => (
  prcPercentOfNonHealthcareBreachesInYearForMethodType(year, "PORT")
)), "#1a9a5c", "Percent of breaches caused by device loss")
)}

function _hibpYearsDomain(d3){return(
d3.range(2011, 2021 + 1)
)}

function _yearOfHIBPBreachAsInt(d3)
{
  const breachYearParser = d3.timeParse("%Y-%m-%d")
  return (breach => breachYearParser(breach["BreachDate"]).getFullYear())
}


function _percentOfHIBPBreachesMatching(hibpBreaches,yearOfHIBPBreachAsInt){return(
function percentOfHIBPBreachesMatching(predicate, year) {
  const totalBreachesInYear = hibpBreaches.filter(breach => ((yearOfHIBPBreachAsInt(breach) == year)))
  const matchingBreachesInYear = totalBreachesInYear.filter(predicate)
  return (parseFloat(matchingBreachesInYear.length) / parseFloat(totalBreachesInYear.length))
}
)}

function _namesBarChart(yearPercentsBarChart,hibpYearsDomain,percentOfHIBPBreachesMatching){return(
yearPercentsBarChart(hibpYearsDomain, (year => (
  percentOfHIBPBreachesMatching(breach => (breach.DataClasses.indexOf("Names") > 0), year)
)), "#603dde", "Percent of breaches containing full names")
)}

function _phoneNumbersBarChart(yearPercentsBarChart,hibpYearsDomain,percentOfHIBPBreachesMatching){return(
yearPercentsBarChart(hibpYearsDomain, (year => (
  percentOfHIBPBreachesMatching(breach => (breach.DataClasses.indexOf("Phone numbers") > 0), year)
)), "#603dde", "Percent of breaches containing phone numbers")
)}

function _homeAddressesBarChart(yearPercentsBarChart,hibpYearsDomain,percentOfHIBPBreachesMatching){return(
yearPercentsBarChart(hibpYearsDomain, (year => (
  percentOfHIBPBreachesMatching(breach => (breach.DataClasses.indexOf("Physical addresses") > 0), year)
)), "#603dde", "Percent of breaches containing home addresses")
)}

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
  main.variable(observer("viewof combineButtonWasClicked")).define("viewof combineButtonWasClicked", ["Inputs"], _combineButtonWasClicked);
  main.variable(observer("combineButtonWasClicked")).define("combineButtonWasClicked", ["Generators", "viewof combineButtonWasClicked"], (G, _) => G.input(_));
  main.variable(observer("infoPricesAnimatedChart")).define("infoPricesAnimatedChart", ["width","marketItems","combinedProfileItem","d3","combinedProfileItemIndex","combineButtonWasClicked"], _infoPricesAnimatedChart);
  main.variable(observer("prcBreaches")).define("prcBreaches", ["FileAttachment"], _prcBreaches);
  main.variable(observer("yearOfPRCBreachAsInt")).define("yearOfPRCBreachAsInt", ["d3"], _yearOfPRCBreachAsInt);
  main.variable(observer("prcYearsDomain")).define("prcYearsDomain", ["d3"], _prcYearsDomain);
  main.variable(observer("organizationTypeCodes")).define("organizationTypeCodes", _organizationTypeCodes);
  main.variable(observer("prcBreachesInYearForOrganizationType")).define("prcBreachesInYearForOrganizationType", ["prcBreaches","yearOfPRCBreachAsInt"], _prcBreachesInYearForOrganizationType);
  main.variable(observer("organizationTypeLines")).define("organizationTypeLines", ["organizationTypes","organizationTypeCodes","prcYearsDomain","relativeNumberOfBreaches"], _organizationTypeLines);
  main.variable(observer("organizationTypes")).define("organizationTypes", ["organizationTypeCodes"], _organizationTypes);
  main.variable(observer("relativeNumberOfBreaches")).define("relativeNumberOfBreaches", ["prcBreachesInYearForOrganizationType"], _relativeNumberOfBreaches);
  main.variable(observer("breachTargetsChart")).define("breachTargetsChart", ["width","d3","prcYearsDomain","organizationTypeLines","organizationTypes"], _breachTargetsChart);
  main.variable(observer("prcNonHealthcareBreachesInYear")).define("prcNonHealthcareBreachesInYear", ["prcBreaches","yearOfPRCBreachAsInt"], _prcNonHealthcareBreachesInYear);
  main.variable(observer("prcPercentOfNonHealthcareBreachesInYearForMethodType")).define("prcPercentOfNonHealthcareBreachesInYearForMethodType", ["prcBreaches","yearOfPRCBreachAsInt"], _prcPercentOfNonHealthcareBreachesInYearForMethodType);
  main.variable(observer("yearPercentsBarChart")).define("yearPercentsBarChart", ["width","d3"], _yearPercentsBarChart);
  main.variable(observer("hackBreachesBarChart")).define("hackBreachesBarChart", ["yearPercentsBarChart","prcYearsDomain","prcPercentOfNonHealthcareBreachesInYearForMethodType"], _hackBreachesBarChart);
  main.variable(observer("accidentalDisclosureBreachesBarChart")).define("accidentalDisclosureBreachesBarChart", ["yearPercentsBarChart","prcYearsDomain","prcPercentOfNonHealthcareBreachesInYearForMethodType"], _accidentalDisclosureBreachesBarChart);
  main.variable(observer("portableDeviceLossBreachesBarChart")).define("portableDeviceLossBreachesBarChart", ["yearPercentsBarChart","prcYearsDomain","prcPercentOfNonHealthcareBreachesInYearForMethodType"], _portableDeviceLossBreachesBarChart);
  main.variable(observer("hibpYearsDomain")).define("hibpYearsDomain", ["d3"], _hibpYearsDomain);
  main.variable(observer("yearOfHIBPBreachAsInt")).define("yearOfHIBPBreachAsInt", ["d3"], _yearOfHIBPBreachAsInt);
  main.variable(observer("percentOfHIBPBreachesMatching")).define("percentOfHIBPBreachesMatching", ["hibpBreaches","yearOfHIBPBreachAsInt"], _percentOfHIBPBreachesMatching);
  main.variable(observer("namesBarChart")).define("namesBarChart", ["yearPercentsBarChart","hibpYearsDomain","percentOfHIBPBreachesMatching"], _namesBarChart);
  main.variable(observer("phoneNumbersBarChart")).define("phoneNumbersBarChart", ["yearPercentsBarChart","hibpYearsDomain","percentOfHIBPBreachesMatching"], _phoneNumbersBarChart);
  main.variable(observer("homeAddressesBarChart")).define("homeAddressesBarChart", ["yearPercentsBarChart","hibpYearsDomain","percentOfHIBPBreachesMatching"], _homeAddressesBarChart);
  return main;
}
