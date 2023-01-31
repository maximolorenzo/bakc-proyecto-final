const socket = io();

const element = document.getElementById("productsFront");
socket.on("socket01", (data) => {
  let products = "";
  data.forEach((product) => {
    products += `<div>
        <p>ID: ${product._id}</p>
        <p>Title: ${product.title}</p>
        <p>Price: $${product.price}</p>
        <br>
    </div>`;
  });
  element.innerHTML = products;
});

const element3 = document.getElementById("deleteBtn");
element3.addEventListener("click", function deleteP() {
  const inputvalue = document.getElementById("deleteID").value;
  socket.emit("deleteProduct", inputvalue);
});
