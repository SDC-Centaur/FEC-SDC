async function test() {
  const body = {
    product_id: 1111,
    rating: 2,
    summary: 'riwwfeowkfoewkfewjfjewfewkfewopfewfwef',
    body: 'wkopfjewfewfewfewfjewfewjfewifiewfewjiofjewfjewffwefewfwefewfewfewfewfewfefffefewfewfefefffewwwwwwwwwwwwwwwwww',
    recommend: false,
    name: 'fefwfew',
    email: 'fwefwe@fewf.com',
    photos: ['sss'],
    characteristics: {
      'Fit': 11,
      'Length': 2,
      'Comfort': 3,
      'Quality': 2
    }
  };

  const url = 'http://127.0.0.1:3000/reviews';
  const options = {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' }
  };

  const res = await fetch(url, options);
  console.log(res.status);
}

test()
