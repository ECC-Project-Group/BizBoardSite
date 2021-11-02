const PDFDocument = require('pdfkit');

/**
 * Takes a UserObject and renders its information to a PDF
 * @param {UserObject} user ...
 * @param {Response} res Response object from express to pipe the file into
 */
function renderAddress(user, res) {
  const document = new PDFDocument();

  res.writeHead(200, {
    'Content-Type': 'application/pdf',
  });

  document.pipe(res);

  // Tweak these settings to whatever BizBoard needs!
  document
    .font('public/SourceSerifPro-Regular.ttf')
    .fontSize(20)
    .lineGap(-12)
    .text(`${user.First.toUpperCase()} ${user.Last.toUpperCase()}`)
    .moveDown()
    .text(user.Address.toUpperCase())
    .moveDown()
    .text(`${user.City.toUpperCase()}, ${user.State.toUpperCase()} ${user.Zip.toUpperCase()}`)
    .moveDown()
    .text(user.Country.toUpperCase());

  document.end();
}

module.exports = { renderAddress };
