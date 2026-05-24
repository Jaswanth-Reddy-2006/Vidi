fetch("http://localhost:3000/api/auth/sign-in/email", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "admin@vidi.store", password: "Admin@123" })
})
.then(r => r.json().then(data => console.log(r.status, data)))
.catch(console.error);
