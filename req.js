const url = "https://xapiverse.com/api/terabox";
const payload = { url: "https://1024terabox.com/s/1Tjf3dLwZZFEg7LxEgOuRnw" };
const headers = {
    "Content-Type": "application/json",
    "xAPIverse-Key": "sk_d35341aacb2113314516800c03737ab2"
};

fetch(url, { method: 'POST', body: JSON.stringify(payload), headers })
  .then(res => res.json())
  .then(data => console.log(JSON.stringify(data, null, 2)))
  .catch(err => console.error(err));
