function PaymentsGG() {
    const orderPlace = () => {
     console.log("order placed");
   };
 
   const loadScript = (src) => {
     return new Promise((resolve) => {
       const script = document.createElement("script");
       script.src = src;
       script.onload = () => {
         resolve(true);
       };
       script.onerror = () => {
         resolve(false);
       };
       document.body.appendChild(script);
     });
   };
 
   const pay = async () => {
     let amount = 100;
     const res = await loadScript(
       "https://checkout.razorpay.com/v1/checkout.js"
     );
 
     if (!res) {
       alert("Razorpay SDK failed to load. Are you online?");
       return;
     }
 
     const options = {
       key: "rzp_test_fREyKXWxjeLkPv", 
       amount: parseInt(amount * 100),
       currency: "INR", 
       name: "DigiDaani", 
       description: "Test Transaction",
       image: "",
       handler: function (response) {
         orderPlace(); 
       },
       prefill: {
         name: "DigiDaani",
         email: "digidaani@gmail.com",
         contact: "8779471231",
       },
       notes: {
         address: "India",
       },
       theme: {
         color: "#158993",
       },
     };
 
     const paymentObject = new window.Razorpay(options);
     paymentObject.open();
   };
 
   return (
     <div className="App">
       <button
         className="button_pay"
         onClick={() => {
           pay();
         }}
       >
         Pay with Razorpay
       </button>
     </div>
   );
 }
 
 export default PaymentsGG;
 