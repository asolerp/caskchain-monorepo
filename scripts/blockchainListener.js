const ethers = require("ethers");

// Configurar el proveedor para apuntar a tu nodo local
const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");

const contractAddress = "0x2099AF073C644DcECB04393B0C3d0d136abB7737";
const CCNftContract = require("../apps/contracts/build/contracts/CCNft.json");

const contract = new ethers.Contract(
  contractAddress,
  CCNftContract.abi,
  provider
);

// Escucha por eventos
contract.on("Mint", (param1, param2, event) => {
  console.log("Event", event);

  // Llama a tu Cloud Function
  fetch("https://us-central1-cask-chain.cloudfunctions.net/onNewMint", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: event,
    }),
  })
    .then((response) => response.json())
    .then((data) => console.log("Respuesta de Firebase:", data))
    .catch((error) =>
      console.error("Error al enviar datos a Firebase:", error)
    );
});
