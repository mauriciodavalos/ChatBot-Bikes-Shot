const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

const flowSecundario = addKeyword(['2', 'siguiente', 'asesoria']).addAnswer(['¿En qué te podemos ayudar?', 'Enseguida un asesor se pondra en contacto contigo'], { capture: true }, (ctx) => {
    console.log('dudaCliente: ', ctx.body)
})
    .addAnswer('Enseguida un asesor se pondra en contacto contigo')


const flowMayoreoSecundario = addKeyword(['mayoreo1', 'mayoreo2'])
    .addAnswer('🙌 Excelente, gracias por considerar Bikes Shot para tu tienda y/o taller, te recordamos que hacemos envíos a todo México')
    .addAnswer(
        [
            '¿Estas listo para hacer tu pedido?',
            '👉[] *Si* ',
            '👉[] Todavia no, Quiero mas información...',
        ],
        null,
        null,
        [flowSecundario]
    )

const flowProds = addKeyword(['Productos', 'prods', 'prod', 'precios', 'precio', 'catalogo', '1', 'Precios y Catalogo'])
    .addAnswer('Quality Bike Lubes and Deagreasers', {
        media: 'https://i.imgur.com/26itajw.jpg',
    })
    .addAnswer(
        [
            'Ver todos los productos',
            '🚴https://wa.me/c/5215526961225',
            '',
            'Comprar en nuestra tienda en linea',
            '🚲https://bikesshot.store/🏍️',
            '',
            '👉Escribe *asesoria* para cualquier otra duda o comentario',
            '',
            'Para volver al menu inicial escribe *empezar*',
        ],
        null,
        null,
        [flowSecundario]
    )

const flowKits = addKeyword(['kits', 'paquetes', '2', 'promociones', 'Kits y Promociones'])
    .addAnswer('Aprovecha el 20% de descuento en el kit Premium, ¡Ultimos dias!', {
        media: 'https://i.imgur.com/lPH3H30.jpg',
    })
    .addAnswer(
        [
            '🙌 Aquí encontras todos nuestros kits',
            'http://bit.ly/3Z7jJA0',
            '',
            'Recuerda que todos los Kits cuentan con Envio Gratis y puedes modificarlos a tus necesidades y/o preferencias',
            '',
            '👉Escribe *asesoria* para cualquier otra duda o comentario',
            '',
            'Para volver al menu inicial escribe *empezar*',
        ],
        null,
        null,
        [flowSecundario]
    )

const flowAsesoria = addKeyword(['4', 'asesoria']).addAnswer(
    [
        '¿Qué duda tienes?',
        '',
        'Enseguida un asesor se pondra en contacto contigo',
    ],
)

const flowSIpedido = addKeyword(['5', 'Vamos']).addAnswer(
    [
        'Porfavor entra en el siguiente link para elaborar tu pedido ',
        '🚀 https://bit.ly/3IpGmsi',

    ])
    .addAnswer(
        [
            'Guarda el documento y envialo al siguiente mail:',
            'contacto@bikesshot.com',
            '',
            '👉Escribe *asesoria* para cualquier otra duda o comentario',
            '',
            'Para volver a este menu inicial escribe *empezar*',
        ],
        null,
        null,
        [flowSecundario]
    )

const flowdudas = addKeyword(['No, Tengo mas dudas']).addAnswer('Enseguida un asesor se pondra en contacto contigo')

const flowNOpedido = addKeyword(['No']).addAnswer(
    ['Bueno Saber:', 'Hacemos envios a toda la republica Méxicana', 'Tiempo de Envio 2 a 5 Dias Habiles', 'Pago Seguro con PayPal o MercadoPago', 'Valor minimo del pedido de $2000 pesos MXN', 'Costo del envio de $150 pesos MXN', 'Puedes personalizar tu pedido conforme a tus necesidades'])
    .addAnswer('Muchas gracias por la informacion, ¿Estas listo para hacer tu pedido?', {
        buttons: [{ body: 'Vamos' },
        { body: 'No, Tengo mas dudas' }],
    }, { capture: true })
    .addAnswer('Escribe *empezar* para regresar al menu incial.',
        null,
        null,
        [flowSecundario, flowdudas, flowSIpedido]
    )

const flowMayoreo = addKeyword(['3', 'Quiero ser Distribuidor', 'Mayoreo', 'Distribuidor'])
    .addAnswer('🙌 Excelente, gracias por considerar Bikes Shot para tu tienda y/o taller, te recordamos que hacemos envíos a todo México')
    .addAnswer('¿Cuál es tu Nombre?', { capture: true }, (ctx) => {
        console.log('NombreCliente: ', ctx.body)
    })
    .addAnswer('¿Cuál es tu Codigo Postal?', { capture: true }, (ctx) => {
        console.log('CodigoPostalCliente: ', ctx.body)
    })
    .addAnswer('Muchas gracias por la informacion, ¿Estas listo para hacer tu pedido?', {
        buttons: [{ body: 'Vamos' },
        { body: 'No' }],
    })
    .addAnswer('Escribe *empezar* para regresar al menu incial.',
        null,
        null,
        [flowSIpedido, flowNOpedido]
    )

const flowString = addKeyword(['string']).addAnswer('Cuentanos un poco mas de ti y tu negocio')
    .addAnswer('Cual es tu Nombre', { capture: true }, (ctx) => {
        console.log('mensaje entrante: ', ctx.body)
    })
    .addAnswer('Escribe *empezar* para regresar al menu incial.',
        null,
        null,
        [flowSIpedido, flowNOpedido]
    )

const flowPrincipal = addKeyword(['hola', 'empezar'])
    .addAnswer('🙌 Hola bienvenido a Bikes Shot')
    .addAnswer('¿Cuentame que te interesa?', {
        buttons: [{ body: 'Precios y Catalogo' },
        { body: 'Kits y Promociones' },
        { body: 'Quiero ser Distribuidor' }],
    })
    .addAnswer(
        [
            '👉Escribe *asesoria* para cualquier otra duda o comentario',
            '',
            'Para volver a este menu inicial escribe *empezar*',
        ],
        null,
        null,
        [flowProds, flowKits, flowMayoreo, flowAsesoria, flowString]
    )

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
