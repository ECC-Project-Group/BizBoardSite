const PDFDocument = require('pdfkit');
const { getUsers } = require('./sheets');
const { checkForExpiration } = require('./dates');

/**
 * Base function to append a page to a PDF document and render a single user
 * @param {PDFDocument} document PDF Document class
 * @param {UserObject} user User to render
 */
function addUserToPage(document, user) {
  document
    .fontSize(20)
    .lineGap(-12)
    .text(`${user.First} ${user.Last}`, 300, 230)
    .moveDown()
    .text(user.Address)
    .moveDown()
    .text(`${user.City}, ${user.State} ${user.Zip}`)
    .moveDown()
    .text(user.Country);
}

/**
 * Takes a UserObject and renders its information to a PDF
 * @param {UserObject} user ...
 * @param {Response} res Response object from express to pipe the file into
 */
function renderAddress(user, res) {
  // Executive page size: 10.55 in by 7.25 in. Fits the designated format best.
  const document = new PDFDocument({
    size: 'EXECUTIVE',
    layout: 'landscape',
    font: 'Times-Roman',
  });

  res.writeHead(200, {
    'Content-Type': 'application/pdf',
  });

  document.pipe(res);

  // Tweak these settings to whatever BizBoard needs!
  addUserToPage(document, user);

  document.end();
}

/**
 * Renders all user records into a PDF
 * @param {Response} res Response object...
 */
function printAll(res) {
  // Executive page size: 10.55 in by 7.25 in. Fits the designated format best.
  const document = new PDFDocument({ size: 'EXECUTIVE', layout: 'landscape' });

  res.writeHead(200, {
    'Content-Type': 'application/pdf',
  });

  getUsers().then((users) => {
    document.pipe(res);

    const { expired, aboutToExpire } = checkForExpiration(users);

    for (let i = 0; i < users.length; i += 1) {
      const user = users[i];

      // Don't print expired subscriptions
      if (expired.includes(user)) {
        // eslint-disable-next-line no-continue
        continue;
      }

      // Bold for those about to expire, otherwise normal font
      if (aboutToExpire.includes(user)) {
        document.font('Times-Bold');
      } else {
        document.font('Times-Roman');
      }

      addUserToPage(document, user);
      document.addPage();
    }

    document.end();
  });
}

module.exports = { renderAddress, printAll };
