import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* Additional Meta Tags */}
        </Head>
        <body>
          <Main />
          <NextScript />
          {/* Bootstrap JS and dependencies */}
          <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js" integrity="sha384-oBqDVmMz4fnFO9gybRe4kAliDfCdLgEKZZR9yZH/qQW4l5FaOcJ+7oNFpSk7lPa2" crossOrigin="anonymous"></script>
          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.min.js" integrity="sha384-QJHtvGhmr9ey6sB6CW5Ka75hBH4XX9Z+6ihhE8fDJIi4Vxg6zNE6D5IkLKjIKublish" crossOrigin="anonymous"></script>
        </body>
      </Html>
    );
  }
}

export default MyDocument;