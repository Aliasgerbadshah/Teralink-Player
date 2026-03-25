fetch('https://itera.codbreaker.com/api/resolve.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'itp_live_36c13b32ee0806f050db50d627a769eefb19efff'
    },
    body: JSON.stringify({ link: 'https://teraboxapp.com/s/1qp35pIpbJKDRroew5fELNQ', action: 'play' })
}).then(res => res.json()).then(data => console.log(JSON.stringify(data, null, 2))).catch(err => console.error(err));
