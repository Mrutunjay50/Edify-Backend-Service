module.exports = ({ noteSummary, subject, title, inwhat }) => {
  const today = new Date().toLocaleDateString();
  return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
      <style>
        .main{
          margin: auto;
          position: relative;
          height: 1100px;
          line-height: 24px;
          font-family: 'Helvetica Neue', 'Helvetica',
        }
        .logo{
          position: absolute;
          bottom: 10px;
          right: 10px;
          font-weight: bolder;
          background: -webkit-linear-gradient(#3e89e4, #180874);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 25px
        }
        .content1{
          padding: 10% 10% 0% 10%;
          display: flex;
          flex-direction : row
          justify-content: space-between;
    
        }
        .headContainer{
          display: flex;
          flex-direction: column;
        }
        .date{
            position: absolute;
          bottom: 10px;
          left: 10px;
        }
        .note{
            padding : 0% 10%
        }
      </style>
    </head>
    <body>
      <div class="main">
        <div class="logo">
          Edify
        </div>
        <div class="content1">
          <div class="headContainer">
            <h2 class="head1">${subject}</h2>
            <h4 class="head2">${title}</h4>
          </div>
          <span class="date">${today}</span>
        </div>
        <div class="note">
          <pre>
${noteSummary}
          </pre>
        </div>
      </div>
    </body>
    </html>`;
};
