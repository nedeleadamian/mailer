const form = document.getElementsByTagName("form");
let status = document.getElementById("status-text");

form[0].addEventListener("submit", onSubmit);

function onSubmit(e) {
  e.preventDefault();

  let form = new FormData();

  let to = document.getElementById("to").value;
  let subject = document.getElementById("subject").value;
  let text = document.getElementById("text").value;

  form.append("to", to);
  form.append("subject", subject);
  form.append("text", text);

  axios.post("http://localhost:3000/send", form, {
      "Content-Type": "multipart/form-data",
    })
    .then((res) => handleResponse(res))
    .catch((err) => handleResponse(err));

  e.target.reset();
}

function handleResponse(res) {
  let statusContainer = document.getElementById("status");
  console.log(res);
  statusContainer.style.display = "block";

  if (res.status == 200) {
    status.textContent = "Email was sent successfully!";
    status.style.color = "green";
  } else {
    status.textContent = "Email was not sent. Please try again.";
    status.style.color = "red";
  }

  setTimeout(() => {
    statusContainer.style.display = "none";
  }, 5000);
}
