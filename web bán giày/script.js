// ================== DATA ==================
const SUPABASE_URL = "https://gvzpczkxrcenymbunqse.supabase.co"

const SUPABASE_KEY =
  "sb_publishable_vIwL4xh_HBsZdPu0h7J2yA_tj5n2Bhg"

const db = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
)

let products = []

// ================== BIẾN ==================
let currentPage = 1
const perPage = 8

let filteredProducts = []

let selectedCategory = ""
let selectedBrands = []

let isLoginMode = true

// ================== DOM ==================
const list = document.getElementById("list")
const search = document.getElementById("search")
const suggest = document.getElementById("suggest")
const cart = document.getElementById("cart")
const pagination = document.getElementById("pagination")

// ================== LOGIN ==================
function toggleMode() {

  isLoginMode = !isLoginMode

  document.getElementById("formTitle").innerText =
    isLoginMode
      ? "Đăng nhập"
      : "Đăng ký"

  document.querySelector(".toggle").innerText =
    isLoginMode
      ? "Chưa có tài khoản? Đăng ký"
      : "Đã có tài khoản? Đăng nhập"
}

async function submitForm() {

  const username =
    document.getElementById("username")
      .value.trim()

  const password =
    document.getElementById("password")
      .value.trim()

  if (!username || !password) {
    alert("Nhập đầy đủ!")
    return
  }

  // LOGIN
  if (isLoginMode) {

    const { data, error } = await db
      .from("shoe_users")
      .select("*")
      .eq("username", username)
      .eq("password", password)

    if (error || data.length === 0) {
      alert("Sai tài khoản!")
      return
    }

    localStorage.setItem("user", username)
    localStorage.setItem("role", data[0].role)

    updateUserUI()

    showCart()

    alert("Đăng nhập thành công!")
  }

  // REGISTER
  else {

    const { data: checkUser } = await db
      .from("shoe_users")
      .select("*")
      .eq("username", username)

    if (checkUser.length > 0) {
      alert("Tài khoản đã tồn tại!")
      return
    }

    await db
     .from("shoe_users")
      .insert([
        {
          username,
          password,
          role: "user"
        }
      ])

    alert("Đăng ký thành công!")

    toggleMode()
  }
}

function updateUserUI() {

  const user =
    localStorage.getItem("user")

  const role =
    localStorage.getItem("role")

  const userBox =
    document.getElementById("user")

  if (user) {

    userBox.innerHTML = `
      <div style="margin-bottom:10px;">
        👤 ${user} (${role || "user"})
      </div>

      <button onclick="logout()">
        Đăng xuất
      </button>

      <button onclick="showHistory()">
        Lịch sử mua
      </button>
    `

    if (role === "admin") {

      userBox.innerHTML += `
        <br><br>

        <button onclick="showAdmin()">
          Quản lý giày
        </button>
      `
    }

  } else {

    userBox.innerHTML = ""
  }
}

function logout() {

  localStorage.removeItem("user")
  localStorage.removeItem("role")

  updateUserUI()

  showCart()

  alert("Đã đăng xuất!")
}

// ================== HIGHLIGHT ==================
function highlight(text, keyword) {

  if (!keyword) return text

  return text.replace(
    new RegExp(keyword, "gi"),
    match =>
      `<span class="highlight">${match}</span>`
  )
}

// ================== FILTER ==================
function applyFilter() {

  const key =
    search.value.toLowerCase()

  filteredProducts =
    products.filter(p => {

      const matchSearch =
        p.name.toLowerCase().includes(key) ||
        p.brand.toLowerCase().includes(key)

      const matchCategory =
        selectedCategory === "" ||
        p.category === selectedCategory

      const matchBrand =
        selectedBrands.length === 0 ||
        selectedBrands.includes(p.brand)

      return (
        matchSearch &&
        matchCategory &&
        matchBrand
      )
    })

  currentPage = 1

  render(filteredProducts, key)
}
function applyFilter() {

  const key =
    search.value.toLowerCase()

  filteredProducts =
    products.filter(p => {

      const matchSearch =
        p.name.toLowerCase().includes(key) ||
        p.brand.toLowerCase().includes(key)

      const matchCategory =
        selectedCategory === "" ||
        p.category === selectedCategory

      const matchBrand =
        selectedBrands.length === 0 ||
        selectedBrands.includes(p.brand)

      return (
        matchSearch &&
        matchCategory &&
        matchBrand
      )
    })

  currentPage = 1

  render(filteredProducts, key)
}
// ================== LỌC DANH MỤC ==================
function filterCategory(category) {

  selectedCategory = category

  applyFilter()

  const title =
    document.querySelector(".content-header h3")

  title.innerText =
  category
    ? `👟 ${category}`
    : "👟 Danh sách giày"
}
// ================== RENDER ==================
function render(data, keyword = "") {

  list.innerHTML = ""

  const start =
    (currentPage - 1) * perPage

  const pageData =
    data.slice(start, start + perPage)

  pageData.forEach(product => {

    list.innerHTML += `
      <div class="book"
        onclick='showDetail("${product.name}")'>

        <img src="${product.img}">

        <h3>
          ${highlight(product.name, keyword)}
        </h3>

        <p>
          ${highlight(product.brand, keyword)}
        </p>

        <p>
          ${product.price.toLocaleString()}đ
        </p>

        <button
          onclick='event.stopPropagation(); buy("${product.name}")'>

          Mua
        </button>

      </div>
    `
  })

  renderPagination(data)
}

// ================== SEARCH ==================
search.addEventListener("input", () => {

  const key =
    search.value.toLowerCase()

  suggest.innerHTML = ""

  applyFilter()

  if (key) {

    suggest.style.display = "block"

    filteredProducts
      .slice(0, 5)
      .forEach(p => {

        const div =
          document.createElement("div")

        div.className = "item"

        div.innerText =
          p.name + " - " + p.brand

        div.onclick = () => {

          search.value = p.name

          suggest.innerHTML = ""

          suggest.style.display = "none"

          applyFilter()
        }

        suggest.appendChild(div)
      })

  } else {

    suggest.style.display = "none"
  }
})



// ================== BRAND ==================
document
  .querySelectorAll(".sidebar input[type=checkbox]")
  .forEach(cb => {

    cb.addEventListener("change", () => {

      selectedBrands = []

      document
        .querySelectorAll(".sidebar input:checked")
        .forEach(c => {

          selectedBrands.push(
            c.parentNode.innerText.trim()
          )
        })

      applyFilter()
    })
  })

// ================== CHI TIẾT ==================
function showDetail(name) {

  const product =
    products.find(p => p.name === name)

  const modal =
    document.getElementById("detailModal")

  const content =
    document.getElementById("detailContent")

  content.innerHTML = `
    <h2>${product.name}</h2>

    <img src="${product.img}"
      style="width:100%">

    <p>
      <b>Hãng:</b>
      ${product.brand}
    </p>

    <p>
      <b>Giá:</b>
      ${product.price.toLocaleString()}đ
    </p>

    <button onclick='buy("${product.name}")'>
      Mua ngay
    </button>
  `

  modal.style.display = "block"
}

// ================== PAGINATION ==================
function renderPagination(data) {

  pagination.innerHTML = ""

  const total =
    Math.ceil(data.length / perPage)

  for (let i = 1; i <= total; i++) {

    pagination.innerHTML += `
      <span class="page"
        onclick="goPage(${i})">

        ${i}

      </span>
    `
  }
}

function goPage(page) {

  currentPage = page

  render(
    filteredProducts,
    search.value.toLowerCase()
  )
}

// ================== MUA ==================
function buy(name) {

  const user =
    localStorage.getItem("user")

  if (!user) {
    alert("Đăng nhập trước!")
    return
  }

  const product =
    products.find(p => p.name === name)

  let cartData =
    JSON.parse(localStorage.getItem("cart")) || []

  cartData.push(product)

  localStorage.setItem(
    "cart",
    JSON.stringify(cartData)
  )

  showCart()
}

// ================== GIỎ HÀNG ==================
function showCart() {

  const role =
    localStorage.getItem("role")

  if (role === "admin") return

  const cartItems =
    JSON.parse(localStorage.getItem("cart")) || []

  cart.innerHTML = ""

  let total = 0

  cartItems.forEach((p, i) => {

    total += p.price

    cart.innerHTML += `
      <p>
        ${p.name}
        -
        ${p.price.toLocaleString()}đ

        <button onclick="remove(${i})">
          Xóa
        </button>
      </p>
    `
  })

  cart.innerHTML += `
    <h3>
      Tổng tiền:
      ${total.toLocaleString()}đ
    </h3>

    <button onclick="pay()">
      Thanh toán
    </button>

    <div id="qrBox"></div>
  `
}

// ================== XÓA ==================
function remove(i) {

  let cartItems =
    JSON.parse(localStorage.getItem("cart")) || []

  cartItems.splice(i, 1)

  localStorage.setItem(
    "cart",
    JSON.stringify(cartItems)
  )

  showCart()
}

// ================== THANH TOÁN ==================
function pay() {

  let cartItems =
    JSON.parse(localStorage.getItem("cart")) || []

  if (cartItems.length === 0) {
    alert("Giỏ hàng trống!")
    return
  }

  document.getElementById("qrBox").innerHTML = `
    <p>Quét mã để thanh toán</p>

    <img
      src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ShoeStoreThanhToan">

    <br><br>

    <button onclick="confirmPay()">
      Đã thanh toán
    </button>
  `
}

async function confirmPay() {

  const user =
    localStorage.getItem("user")

  let cartItems =
    JSON.parse(localStorage.getItem("cart")) || []

  for (let item of cartItems) {

    await db
      .from("shoe_orders")
      .insert([
        {
          username: user,
          product_name: item.name,
          price: item.price
        }
      ])
  }

  alert("Thanh toán thành công!")

  localStorage.removeItem("cart")

  showCart()

  document.getElementById("qrBox").innerHTML = ""
}

// ================== ADMIN ==================
function showAdmin() {

  const role =
    localStorage.getItem("role")

  if (role !== "admin") {
    return
  }

  let html = `
    <h2>👑 ADMIN PANEL</h2>

    <div style="
      border:2px solid #333;
      padding:15px;
      margin-bottom:20px;
      border-radius:10px;
    ">

      <h3>➕ Thêm mẫu giày</h3>

      <input id="addName" placeholder="Tên"><br><br>

      <input id="addBrand" placeholder="Hãng"><br><br>

      <input id="addPrice"
        type="number"
        placeholder="Giá"><br><br>

      <input id="addImg"
        placeholder="Ảnh"><br><br>

      <input id="addCategory"
        placeholder="Danh mục"><br><br>

      <button onclick="addProduct()">
        Thêm
      </button>

    </div>
  `

  products.forEach(product => {

    html += `
      <div style="
        border:1px solid #ccc;
        padding:10px;
        margin:10px 0;
        border-radius:10px;
      ">

        <b>${product.name}</b>

        <br>

        ${product.brand}

        <br>

        ${product.price.toLocaleString()}đ

        <br><br>

        <button onclick="editProduct(${product.id})">
          Sửa
        </button>

        <button onclick="deleteProduct(${product.id})">
          Xóa
        </button>

      </div>
    `
  })

  cart.innerHTML = html
}

// ================== THÊM ==================
async function addProduct() {

  const name =
    document.getElementById("addName").value

  const brand =
    document.getElementById("addBrand").value

  const price =
    document.getElementById("addPrice").value

  const img =
    document.getElementById("addImg").value

  const category =
    document.getElementById("addCategory").value

  await db
    .from("shoe_products")
    .insert([
      {
        name,
        brand,
        price: Number(price),
        img,
        category
      }
    ])

  alert("Thêm thành công!")

  await loadProducts()

  showAdmin()
}

// ================== XÓA ==================
async function deleteProduct(id) {

  const ok =
    confirm("Xóa sản phẩm?")

  if (!ok) return

  await db
   .from("shoe_products")
    .delete()
    .eq("id", id)

  await loadProducts()

  showAdmin()
}

// ================== SỬA ==================
async function editProduct(id) {

  const product =
    products.find(p => p.id === id)

  const name =
    prompt("Tên:", product.name)

  const brand =
    prompt("Hãng:", product.brand)

  const price =
    prompt("Giá:", product.price)

  const img =
    prompt("Ảnh:", product.img)

  const category =
    prompt("Danh mục:", product.category)

  await db
    .from("shoe_products")
    .update({
      name,
      brand,
      price: Number(price),
      img,
      category
    })
    .eq("id", id)

  alert("Sửa thành công!")

  await loadProducts()

  showAdmin()
}

// ================== LỊCH SỬ ==================
async function showHistory() {

  const user =
    localStorage.getItem("user")

  const { data } = await db
  .from("shoe_orders")
    .select("*")
    .eq("username", user)
    .order("id", {
      ascending: false
    })

  let html = `
    <h2>📜 Lịch sử mua</h2>
  `

  let total = 0

  data.forEach(order => {

    total += order.price

    html += `
      <div style="
        border:1px solid #ccc;
        padding:10px;
        margin:10px 0;
        border-radius:10px;
      ">

        <b>${order.product_name}</b>

        <br><br>

        ${order.price.toLocaleString()}đ

        <br>

        ${new Date(
          order.created_at
        ).toLocaleString()}

      </div>
    `
  })

  html += `
    <h3>
      Tổng tiền:
      ${total.toLocaleString()}đ
    </h3>
  `

  cart.innerHTML = html
}

// ================== LOAD PRODUCTS ==================

 // ================== LOAD PRODUCTS ==================
async function loadProducts() {

  const { data, error } = await db
    .from("shoe_products")
    .select("*")

  if (error) {
    console.log(error)
    return
  }

  console.log("DATA:", data)

  products = data

  filteredProducts = [...products]

  render(products)
}

// ================== CLICK NGOÀI ==================
document.addEventListener("click", function(e) {

  const loginModal =
    document.getElementById("loginModal")

  const detailModal =
    document.getElementById("detailModal")

  if (e.target === loginModal)
    loginModal.style.display = "none"

  if (e.target === detailModal)
    detailModal.style.display = "none"
})

// ================== LOAD ==================
window.onload = async () => {

  await loadProducts()

  showCart()

  updateUserUI()

  search.setAttribute(
    "autocomplete",
    "off"
  )

  search.value = ""
}


  