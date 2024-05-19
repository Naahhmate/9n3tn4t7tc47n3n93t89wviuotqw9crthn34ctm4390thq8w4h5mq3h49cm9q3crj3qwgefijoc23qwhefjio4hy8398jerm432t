const blacklistedIPs = ["178.84.8.78","8.8.8.8"];

fetch('https://api.ipify.org?format=json')
  .then(response => response.json())
  .then(data => {
    if (blacklistedIPs.includes(data.ip)) {
      document.write(`You have been blacklisted! ip: ${data.ip}`)
      document.title = 'Blacklisted'
      document.querySelector("link[rel~='icon']").href = "";
      return
    }
  })
  .catch(error => console.error('Error:', error));