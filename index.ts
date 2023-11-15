import { Response } from './interfaces';
import { TLanguage } from './types';

let response: Response;

const dispatcher = async (event: any) => {
    const { sessionState, bot } = event;
    const { localeId } = bot;
    const botLanguage = localeId as TLanguage;

    console.info('botLanguage => ', botLanguage);

    response = {
        sessionState: {
            sessionAttributes: sessionState.sessionAttributes,
            dialogAction: {
                type: 'Close',
            },
            intent: {
                name: sessionState.intent.name,
                state: 'InProgress',
            },
        },
        messages: [
            {
                contentType: 'PlainText',
                content: getInitialMessage(botLanguage),
            },
            {
                contentType: 'ImageResponseCard',
                content: 'Options',
                imageResponseCard: getDynamicImageResponseCard(botLanguage),
            },
        ],
    };

    response.sessionState.sessionAttributes = sessionState.sessionAttributes;
    response.sessionState.intent.name = sessionState.intent.name;

    console.info('EVENT => ', event);
    console.info(
        'event.sessionState.intent.name => ',
        sessionState.intent.name
    );
    console.info(
        'event.sessionState.intent.slots => ',
        sessionState.intent.slots
    );

    switch (sessionState.intent.name) {
        case 'MainOptions':
            const option =
                sessionState.intent.slots.options.value.originalValue;
            await mainOptionsIntent(option, botLanguage);
            break;
        case 'DownloadCV':
            response.messages[0].contentType = 'CustomPayload';
            const text =
                botLanguage === 'es_ES'
                    ? `Está listo para descargar. Haga clic [Leonardo Aranguren CV](${process.env.ES_CV_URL})`
                    : `It's ready for download. Click [Leonardo Aranguren CV](${process.env.EN_CV_URL})`;
            await responseFulfilled(text);
            break;
        default:
            const failedMessage =
                botLanguage === 'es_ES'
                    ? 'No existe esa opción'
                    : 'No option available';
            await responseFailed(failedMessage);
            break;
    }

    return response;
};

const mainOptionsIntent = async (option: string, botLanguage: TLanguage) => {
    let mainOption: string;
    switch (option) {
        case '1':
            mainOption =
                botLanguage === 'es_ES'
                    ? 'Leonardo Aranguren es Desarrollador Full Stack, Arquitecto de Soluciones y Líder Técnico. Atento a los avances tecnológicos, ostentando múltiples certificaciones AWS. Entusiasta por las soluciones de arquitectura en la nube, bilingüe y comprometido con el aprendizaje continuo y la superación de cada desafío'
                    : 'Leonardo Aranguren is a Full Stack Developer, Solutions Architect and Technical Lead. Attentive to technological advancements, holding multiple AWS certifications. Enthusiastic about cloud architecture solutions, bilingual, and committed to continuous learning and overcoming every challenge';
            await responseFulfilled(mainOption);
            break;

        case '2':
            mainOption =
                botLanguage === 'es_ES'
                    ? 'Contacta con Leonardo vía email: leoaranguren10@gmail.com'
                    : 'Contact Leonardo via email: leoaranguren10@gmail.com';
            response.messages[0].contentType = 'CustomPayload';
            await responseFulfilled(mainOption);
            break;

        case '3':
            mainOption =
                botLanguage === 'es_ES'
                    ? 'Este sitio web ha sido creado por Leonardo Aranguren, utilizando un conjunto completo de servicios de AWS. Su objetivo principal es mostrar las metodologías, compartir conocimientos y trabajos del autor.'
                    : 'This website has been created by Leonardo Aranguren, utilizing a comprehensive suite of AWS services. Its primary aim is to showcase the methodologies, share knowledge, and works of the author';
            await responseFulfilled(mainOption);
            break;

        default:
            break;
    }
};

const responseFulfilled = async (message: string) => {
    console.log('responseFulfilled => ', message);
    response.sessionState.intent.state = 'Fulfilled';
    response.messages[0].content = message;
};

const responseFailed = async (message: string) => {
    console.warn('responseFailed => ', message);
    response.sessionState.intent.state = 'Failed';
    response.messages[0].content = message;
};

const getDynamicImageResponseCard = (botLanguage: TLanguage) => {
    const cardContent = botLanguage === 'es_ES' ? 'Opciones' : 'Options';
    const title = botLanguage === 'es_ES' ? '¿Algo más?' : 'Anything else?';
    const buttons = [
        {
            text:
                botLanguage === 'es_ES'
                    ? 'Sobre Leonardo Aranguren (1)'
                    : 'About Leonardo Aranguren (1)',
            value: '1',
        },
        {
            text:
                botLanguage === 'es_ES'
                    ? 'Contactar a Leonardo Aranguren (2)'
                    : 'Contact Leonardo Aranguren (2)',
            value: '2',
        },
        {
            text:
                botLanguage === 'es_ES'
                    ? 'Propósito del sitio web (3)'
                    : 'Purpose of the website (3)',
            value: '3',
        },
        {
            text:
                botLanguage === 'es_ES'
                    ? 'Obtener CV de Leonardo Aranguren (4)'
                    : 'Get Leonardo Aranguren CV (4)',
            value: '4',
        },
    ];

    return {
        title,
        buttons,
        content: cardContent,
    };
};

const getInitialMessage = (botLanguage: TLanguage) => {
    return botLanguage === 'es_ES'
        ? '¡Hola! ¿En qué puedo ayudarte hoy?'
        : 'Hello! How can I assist you today?';
};

export const handler = async (event: any) => {
    return dispatcher(event);
};
