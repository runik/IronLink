export const get404Page = (slug: string): string => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Link Not Found - IronLink</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        margin: 0;
        padding: 0;
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #333;
      }
      .container {
        text-align: center;
        max-width: 600px;
        padding: 2rem;
        position: relative;
      }
      .error-card {
        background: white;
        border-radius: 16px;
        padding: 3rem 2rem;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        position: relative;
        overflow: hidden;
      }
      .clamp-left {
        position: absolute;
        left: -60px;
        top: 50%;
        transform: translateY(-50%);
        width: 80px;
        height: 120px;
        background: #ff6b35;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 2rem;
        font-weight: bold;
        box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
      }
      .clamp-right {
        position: absolute;
        right: -60px;
        top: 50%;
        transform: translateY(-50%);
        width: 80px;
        height: 120px;
        background: #ff6b35;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 2rem;
        font-weight: bold;
        box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
      }
      .error-code {
        font-size: 4rem;
        font-weight: bold;
        margin: 0 0 1rem 0;
        color: #667eea;
        opacity: 0.9;
      }
      .error-message {
        font-size: 1.8rem;
        margin: 0 0 1.5rem 0;
        color: #333;
        font-weight: 600;
      }
      .description {
        font-size: 1.1rem;
        margin-bottom: 2rem;
        color: #666;
        line-height: 1.6;
      }
      .home-link {
        display: inline-block;
        background: #667eea;
        color: white;
        text-decoration: none;
        padding: 14px 28px;
        border-radius: 8px;
        font-weight: 600;
        font-size: 1rem;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
      }
      .home-link:hover {
        background: #5a6fd8;
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
      }
      .shortcode {
        font-family: 'Courier New', monospace;
        background: #f8f9fa;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 0.9rem;
        color: #667eea;
        border: 1px solid #e9ecef;
        font-weight: 600;
      }
      .header {
        background: #667eea;
        color: white;
        padding: 1rem 2rem;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: 600;
      }
      .header-title {
        font-size: 1.2rem;
      }
      .main-content {
        margin-top: 80px;
      }
    </style>
  </head>
  <body>
    <div class="header">
      <div class="header-title">[ Iron Link ]</div>
    </div>
    <div class="container">
      <div class="error-card">
        <div class="clamp-left">⚙</div>
        <div class="clamp-right">⚙</div>
        <div class="main-content">
          <h1 class="error-code">404</h1>
          <h2 class="error-message">Link Not Found</h2>
          <p class="description">
            The link with slug <span class="shortcode">${slug}</span> doesn't exist or has been removed.
          </p>
          <a href="/" class="home-link">Go to Homepage</a>
        </div>
      </div>
    </div>
  </body>
  </html>
`;

export const get500Page = (): string => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Server Error - IronLink</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        margin: 0;
        padding: 0;
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #333;
      }
      .container {
        text-align: center;
        max-width: 600px;
        padding: 2rem;
        position: relative;
      }
      .error-card {
        background: white;
        border-radius: 16px;
        padding: 3rem 2rem;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        position: relative;
        overflow: hidden;
      }
      .clamp-left {
        position: absolute;
        left: -60px;
        top: 50%;
        transform: translateY(-50%);
        width: 80px;
        height: 120px;
        background: #ff6b35;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 2rem;
        font-weight: bold;
        box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
      }
      .clamp-right {
        position: absolute;
        right: -60px;
        top: 50%;
        transform: translateY(-50%);
        width: 80px;
        height: 120px;
        background: #ff6b35;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 2rem;
        font-weight: bold;
        box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
      }
      .error-code {
        font-size: 4rem;
        font-weight: bold;
        margin: 0 0 1rem 0;
        color: #ff6b6b;
        opacity: 0.9;
      }
      .error-message {
        font-size: 1.8rem;
        margin: 0 0 1.5rem 0;
        color: #333;
        font-weight: 600;
      }
      .description {
        font-size: 1.1rem;
        margin-bottom: 2rem;
        color: #666;
        line-height: 1.6;
      }
      .home-link {
        display: inline-block;
        background: #667eea;
        color: white;
        text-decoration: none;
        padding: 14px 28px;
        border-radius: 8px;
        font-weight: 600;
        font-size: 1rem;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
      }
      .home-link:hover {
        background: #5a6fd8;
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
      }
      .header {
        background: #667eea;
        color: white;
        padding: 1rem 2rem;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: 600;
      }
      .header-title {
        font-size: 1.2rem;
      }
      .main-content {
        margin-top: 80px;
      }
    </style>
  </head>
  <body>
    <div class="header">
      <div class="header-title">[ Iron Link ]</div>
    </div>
    <div class="container">
      <div class="error-card">
        <div class="clamp-left">⚙</div>
        <div class="clamp-right">⚙</div>
        <div class="main-content">
          <h1 class="error-code">500</h1>
          <h2 class="error-message">Server Error</h2>
          <p class="description">
            Something went wrong on our end. Please try again later.
          </p>
          <a href="/" class="home-link">Go to Homepage</a>
        </div>
      </div>
    </div>
  </body>
  </html>
`; 