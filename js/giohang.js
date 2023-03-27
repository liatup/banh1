
// giới hạn sản phẩm
function randomId() {
    return Math.floor(Math.random() * 100000);
}

// đổi đơn vị
function convertMoney(num) {
    return num.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
}

// sản phẩm
let products = [
    {
        id: randomId(),
        name: 'Bánh bông lan việt quất và mâm xôi',
        description:
            'Hương vị mang từ những trái việt quất và mâm xôi chín quả hương vị vô cùng đậm đà, đây là món ăn vô cùng đặc biệt trong tháng 3 này',
        price: 30000,
        image:
        'image/banh5.jpg',
        count: 1,
    },
    {
        id: randomId(),
        name: 'Cup cake ngọc trai ',
        description:
            'Hương kem ngào ngạt, chất bánh vô cùng mềm mịn và có vị ngọt thanh, trang trí tỉ mỉ lên bên trên giúp bánh thu hút như những viên ngọc trai ',
        price: 30000,
        image:
            'image/banh1.jpg',
        count: 1,
    },
    {
        id: randomId(),
        name: 'Cup cake nguyên dâu',
        description:
            'Những quả dâu chín mộng được đưa từ đà lạt về ngay khi tới mùa, vị chua nhẹ được trộn với bột bánh tạo nên hương vị mới được dùng chung với quả dâu nguyên và một lớp kem vani mềm mịn',
        price: 30000,
        image:
            'image/banh3.jpg',
        count: 1,
    },
    {
        id: randomId(),
        name: 'Bánh mỳ bơ tỏi',
        description:
            'Đây là loại bánh mới được ra mắt đây không lâu nhưng lại thu hút các bạn trẻ vì sự béo ngậy của bơ kết hợp với phô mai tan chảy và vị tỏi giúp nâng tầm  hương vị bánh  ',
        price: 50000,
        image:
            'image/banh2.jpg',
        count: 1,
    },
    {
        id: randomId(),
        name: 'Bánh kem trái cây ',
        description:
            'Sự kết hợp đa dạng của các loại trái cây nhiệt đới theo mùa để tăng tính đa dạng thành phần bánh, phần kem của bánh sánh và mịn vô cùng thích hợp để dùng trong các bữa phụ vào những tháng nắng nóng như này ',
        price: 100000,
        image:
            'image/banh9.jpg',
        count: 1,
    },
    
];

// cập nhật vào mã giảm
let promotionCode = {
    A: 10,
    B: 20,
    C: 30,
    D: 40,
    MAITHAIQUOC:100,
};

// Truy cập biến ta gọi 
let productsEle = document.querySelector('.products');

let subTotalEl = document.querySelector('.subtotal span');
let vatEl = document.querySelector('.vat span');
let discount = document.querySelector('.discount');
let discountEle = document.querySelector('.discount span');
let totalEle = document.querySelector('.total span');

let btnPromotion = document.querySelector('.promotion button');
let inputPromotion = document.querySelector('#promo-code');

// tạo sản phẩm có được theo vòng lặp for
function renderUI(arr) {
    productsEle.innerHTML = '';

    // số lượng trong giỏ hàng
    let countEle = document.querySelector('.count');
    countEle.innerText = `Số lượng bánh được thêm vào là ${updateTotalItem(arr)}  `;

    // tính tiền được thêm
    updateTotalMoney(arr);

    if (arr.length == 0) {
        productsEle.insertAdjacentHTML(
            'afterbegin',
            '<li>Không có sản phẩm nào trong giỏ hàng</li>'
        );
        document.querySelector('.option-container').style.display = 'none';
        return;
    }
    // dùng for tạo vòng lập như điền ở danh mục sản phẩm
    for (let i = 0; i < arr.length; i++) {
        const p = arr[i];
        productsEle.innerHTML += `
            <li class="row">
                <div class="col left">
                    <div class="thumbnail sp1">
                        <a href="#">
                             <img src="${p.image}" alt="${p.name}" >
                        </a>
                    </div>
                    <div class="detail">
                        <div class="name"><a href="#">${p.name}</a></div>
                        <div class="description">
                            ${p.description}
                        </div>
                        <div class="price">${convertMoney(p.price)}</div>
                    </div>
                </div>
                <div class="col right">
                    <div class="quantity">
                        <input 
                            type="number" 
                            class="quantity" 
                            step="1" 
                            value="${p.count}" 
                            onchange="changeTotalProduct(${p.id}, event)"
                        >
                    </div>
                    <div class="remove">
                        <span class="close" onclick="removeItem(${p.id})">
                            <i class="fa fa-times" aria-hidden="true"></i>
                        </span>
                    </div>
                </div>
            </li>
        `;
    }
}

// Cập nhật số lượng sản phẩm
function updateTotalItem(arr) {
    let total = 0;
    for (let i = 0; i < arr.length; i++) {
        const p = arr[i];
        total += p.count;
    }
    return total;
}

// xóa số lượng
function removeItem(id) {
    for (let i = 0; i < products.length; i++) {
        if (products[i].id == id) {
            products.splice(i, 1);
        }
    }
    renderUI(products);
}

// cập nhật thay đổi số lượng
function changeTotalProduct(id, e) {
    for (let i = 0; i < products.length; i++) {
        if (products[i].id == id) {
            products[i].count = Number(e.target.value);
        }
    }
    renderUI(products);
}

// cập nhật lại số tiền khi thêm đô
function updateTotalMoney(arr) {
    let totalMoney = 0;
    let discountMoney = 0;

    for (let i = 0; i < arr.length; i++) {
        const p = arr[i];
        totalMoney += p.count * p.price;
    }
    // Kiểm tra mã voucher khuyến mãi
    let data = checkPromotion();

    if (data) {
        discountMoney = (totalMoney * data) / 100;
        discount.classList.remove('hide');
    } else {
        discount.classList.add('hide');
    }

    // Cập nhật tiền lên trên giao diện
    subTotalEl.innerText = convertMoney(totalMoney);
    vatEl.innerText = convertMoney(totalMoney * 0.05);
    discountEle.innerText = convertMoney(discountMoney);
    totalEle.innerText = convertMoney(totalMoney * 1.05 - discountMoney);
}

// Kiểm tra mã giảm giá
function checkPromotion() {
    let value = inputPromotion.value;
    if (promotionCode[value]) {
        return promotionCode[value];
    }
    return 0;
}

btnPromotion.addEventListener('click', function () {
    updateTotalMoney(products);
});

window.onload = renderUI(products); 