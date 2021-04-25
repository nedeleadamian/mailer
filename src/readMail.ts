import Imap from "imap";
import {inspect} from "util";

export default (email: string, password: string) => {
  const imap = new Imap({
    user: email,
    password: password,
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
    tlsOptions: {
      host: 'imap.gmail.com',
      rejectUnauthorized: false
    }
  });

  function openInbox(cb) {
    imap.openBox('INBOX', true, cb);
  }

  imap.once('ready', function() {
    openInbox(function(err, box) {
      if (err) throw err;
      imap.search(['UNSEEN', ['SINCE', 'March 21, 2021']], function(err, results) {
        if (err) throw err;
        const f = imap.fetch(results, { bodies: '' });
        f.on('message', function(msg, seqno) {
          console.log('Message #%d', seqno);
          const prefix = '(#' + seqno + ') ';
          msg.on('body', function(stream, info) {
            let buffer = '';
            stream.on('data', function(chunk) {
              buffer += chunk.toString('utf8');
            });
            stream.once('end', function() {
              console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
            });
          });
          msg.once('attributes', function(attrs) {
            console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
          });
          msg.once('end', function() {
            console.log(prefix + 'Finished');
          });
        });
        f.once('error', function(err) {
          console.log('Fetch error: ' + err);
        });
        f.once('end', function() {
          console.log('Done fetching all messages!');
          imap.end();
        });
      });
    });
  });

  imap.once('error', function(err) {
    console.log(err);
  });

  imap.once('end', function() {
    console.log('Connection ended');
  });

  imap.connect();
}
