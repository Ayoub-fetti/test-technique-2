let pricingData = null
let currentProduct = "WorkshopDataCars"
let currentCurrency = "GBP"
let currentPeriod = "monthly"

document.addEventListener("DOMContentLoaded", () => {
  loadpricedata()
  makeeventLis()
})

function loadpricedata() {
  fetch("pricing-data.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load pricing data")
      }
      return response.json()
    })
    .then((data) => {
      pricingData = data
      renderPricingCards()
    })
    .catch((error) => {
      console.error("Error loading pricing data:", error)
      document.getElementById("pricing-container").innerHTML =
        '<div class="col-span-2 text-center text-red-600">Error loading pricing data. Please refresh the page.</div>'
    })
}

function makeeventLis() {
  document.getElementById("btn-cars").addEventListener("click", function () {
    makeActiveBtn("product-btn", this)
    currentProduct = "WorkshopDataCars"
    renderPricingCards()
  })

  document.getElementById("btn-trucks").addEventListener("click", function () {
    makeActiveBtn("product-btn", this)
    currentProduct = "WorkshopDataTrucks"
    renderPricingCards()
  })

  document.getElementById("btn-gbp").addEventListener("click", function () {
    makeActiveBtn("currency-btn", this)
    currentCurrency = "GBP"
    renderPricingCards()
  })

  document.getElementById("btn-eur").addEventListener("click", function () {
    makeActiveBtn("currency-btn", this)
    currentCurrency = "EUR"
    renderPricingCards()
  })

  document.getElementById("btn-monthly").addEventListener("click", function () {
    makeActiveBtn("period-btn", this)
    currentPeriod = "monthly"
    renderPricingCards()
  })

  document.getElementById("btn-annual").addEventListener("click", function () {
    makeActiveBtn("period-btn", this)
    currentPeriod = "annual"
    renderPricingCards()
  })
}

function makeActiveBtn(className, activeButton) {
  const buttons = document.querySelectorAll("." + className)
  buttons.forEach((btn) => btn.classList.remove("active"))
  activeButton.classList.add("active")
}


function renderPricingCards() {
  if (!pricingData) return

  const container = document.getElementById("pricing-container")
  const product = pricingData.products[currentProduct]
  const currencySymbol = pricingData.currencies[currentCurrency]

  container.innerHTML = ""

  const packs = product.packs

  Object.keys(packs).forEach((packKey) => {
    const pack = packs[packKey]
    const pricing = pack.pricing[currentPeriod][currentCurrency]
    const features = pack.features[currentPeriod]
    const users = pack.users

    const card = createPricingCard(
      pack.name,
      pricing.price,
      currencySymbol,
      currentPeriod,
      features,
      users,
      pricing.link,
    )

    container.appendChild(card)
  })
}


function createPricingCard(name, price, currencySymbol, period, features, users, link) {
  const template = document.getElementById("pricing-card-template")
  const card = template.content.cloneNode(true)

  const isFeatured = name.includes("Electronic")
  const badge = card.querySelector(".badge")
  badge.innerHTML = isFeatured
    ? '<div class="inline-block bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">POPULAR</div>'
    : '<div class="h-7 mb-4"></div>'

  card.querySelector("h3").textContent = name
  card.querySelector(".price").textContent = `${currencySymbol}${price}`
  card.querySelector(".period").textContent = `/${period === "monthly" ? "month" : "year"}`

  const usersContainer = card.querySelector(".users")
  usersContainer.innerHTML = users
    .map(
      (userCount) => `
      <span class="px-3 py-1 bg-gray-100 rounded-md text-sm font-medium">${userCount} users</span>
    `,
    )
    .join("")

  const subscribeBtn = card.querySelector(".subscribe-btn")
  subscribeBtn.href = link
  subscribeBtn.textContent = "Subscribe Now"
  subscribeBtn.className = `block w-full text-center py-3 px-6 rounded-lg font-semibold transition-colors mb-6 ${
    isFeatured ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-900 text-white hover:bg-gray-800"
  }`

  const featuresContainer = card.querySelector(".features")
  featuresContainer.innerHTML += features
    .map(
      (feature) => `
      <div class="flex items-start gap-2">
        <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <span class="text-gray-700 text-sm">${feature}</span>
      </div>
    `,
    )
    .join("")

  return card
}
