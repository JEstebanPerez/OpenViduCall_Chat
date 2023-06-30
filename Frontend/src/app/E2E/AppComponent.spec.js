const { test, expect, chromium } = require('@playwright/test');

test('Should connect to the session and put a message and get it back', async () => {
  const browser = await chromium.launch({ headless: true , deviceScaleFactor: 1, // especificar el factor de escala de la página
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)', // especificar el user agent
  args : ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream"]
});

  const context = await browser.newContext({
    permissions: ['camera', 'microphone'],
  });
  
  const page1 = await context.newPage();
  await page1.goto('http://127.0.0.1:4200');
  
  await page1.click('#join-button');
 
  await page1.click('#chat-panel-btn');
  
  await page1.type('#textAreaForm', 'Ejemplo');

  await page1.click('.sendButton');

  const page2 = await context.newPage();
  await page2.goto('http://127.0.0.1:4200');
  
  await page2.click('#join-button');
 
  await page2.click('#chat-panel-btn');

  const parentElement = await page2.$('.upper');

  const element = await parentElement.$(':last-child');

  const children = await parentElement.$$('mat-card-subtitle');

  const lastChild = children.pop();

  const texto = await lastChild.textContent(); // Obtiene el contenido de texto del elemento

  expect(texto).toContain('Ejemplo'); // Comprueba si el texto específico está presente en el contenido del elemento

  // Cerrar las páginas y el navegador
  await Promise.all([page1.close(), page2.close()]);
  await browser.close();  
});
