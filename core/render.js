const PDFDocument = require('pdfkit');
const { getUsers } = require('./sheets');
const { checkForExpiration } = require('./dates');

/**
 * Base function to append a page to a PDF document and render a single user
 * @param {PDFDocument} document PDF Document class
 * @param {UserObject} user User to render
 * @param {number} opt Option for 0 = normal, 1 = about to expire, 2 = expired
 */
function addUserToPage(document, user, opt) {
  document
    .fontSize(20)
    .lineGap(-12)
    .text(
      `${user.First} ${user.Last}`,
      document.x,
      // Middle of page and subtract an arbitrary number to make it look vertically aligned.
      document.page.height / 2 - 38,
      {
        align: 'center',
      },
    )
    .moveDown()
    .text(user.Address, {
      align: 'center',
    })
    .moveDown()
    .text(`${user.City}, ${user.State} ${user.Zip}`, {
      align: 'center',
    })
    .moveDown()
    .text(user.Country, {
      align: 'center',
    });

  let notice = '';

  if (opt === 1) {
    notice = 'NOTICE: Your subscription is expiring soon. See the slip inside for more information.';
  } else if (opt === 2) {
    notice = 'NOTICE: Your subscription has expired. See the slip inside for more information.';
  }

  document
    .fontSize(17)
    .text(`${notice}`, document.x, document.page.height - 95, {
      align: 'center',
    });
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
  const document = new PDFDocument({
    size: 'EXECUTIVE',
    layout: 'landscape',
    font: 'Times-Roman',
  });

  res.writeHead(200, {
    'Content-Type': 'application/pdf',
  });

  getUsers().then((users) => {
    document.pipe(res);

    const { expired, aboutToExpire } = checkForExpiration(users);

    for (let i = 0; i < users.length; i += 1) {
      const user = users[i];

      // Opt used in addUserToPage. 0 = normal, 1 = about to expire, 2 = expired
      let opt = 0;

      if (aboutToExpire.includes(user)) {
        opt = 1;
      } else if (expired.includes(user)) {
        opt = 2;
      }

      addUserToPage(document, user, opt);
      document.addPage();
    }

    document.end();
  });
}

module.exports = { renderAddress, printAll };
