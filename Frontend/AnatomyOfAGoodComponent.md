## Orden:
En líneas generales, un componente debería estar estructurado de la siguiente manera:
- Imports
- Declaracion de función de componente
- Props destructuradas
- Estados
- Requests
- useEffects
- Variables útiles para el JSX
- Estilos destructurados
- Return early (error, loading, etc)
- Return JSX
- {JSX}
- PropTypes
- Export

### Imports
Imports correctamente separados por tipo (External Components, Utils & Config, Internal Components)

```javascript
// External Components
import React, { useEffect, useState } from "react";
import { Box, Checkbox, CircularProgress, FormControl, FormControlLabel, TextField } from "@material-ui/core";
import { Link } from "react-router-dom";

// Utils & Config
import is from "is_js";
import PropTypes from 'prop-types';
import { t } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import DataService from "../services/DataService";

// Internal Components
import Button from '../atoms/Button';

// Icons & Images
const someImage = require('../../images/someImage.png');
```

### Inicialización del componente
Arrow function, recibe el objeto 'props' que posteriormente se destructura para corroborar cuáles están en uso.

```javascript
const ContactForm = (props) => {

    const { isCompany, width, afterSentFn } = props;
```

### Estados
Para mejorar la legibilidad y la rápida comprensión del código, los estados están siempre al principio del componente (debajo de la destructuración de props) separados por su responsabilidad.

```javascript
    // UI States
    const [formValues, setFormValues] = useState(initialFormValues);
    const [submitStatus, setSubmitStatus] = useState(SubmitStatusEnum.IDLE);
    const [errors, setErrors] = useState({});

    // Data States
    const [countryOptions, setCountryOptions] = useState([]);

```

### Funciones asíncronas
Inmediatamente después de los estados. Las llamadas al backend dan la mayor pauta de la responsabilidad del componente.
```javascript
    const getNationalityOptions = async () => {
        try {
            const res = await DataService.getNationalities();
            setCountryOptions(res.data);
        } catch (err) {
            console.log(err);
        } finally {
            // Here you can set loading/error status
        }
    };

    const send = async () => {
        const body = formValues;

        setSubmitStatus(SubmitStatusEnum.SENDING);

        try {
            const res = await DataService.sendCompanyContactEmail(body);
            setSubmitStatus(SubmitStatusEnum.SENT);
            setFormValues(initialFormValues);
        } catch (err) {
            console.log(e);
            setSubmitStatus(SubmitStatusEnum.ERROR);
        }

        window.gtag('event', 'submit', {
            'event_category': 'form',
            'event_label': `contact_form_${isCompany ? 'company' : 'host'}`,
        });
    };

    const handleSend = () => {
        const errs = validateFormData();

        if (is.not.empty(errs)) {
            setErrors(errs);
            return;
        }

        send();
    };
 ```

### useEffects
Por lo general, en los useEffect se ejecutan los llamados al backend, de manera que es bueno tenerlos inmediatamente después de las funciones asíncronas

```javascript
    useEffect(() => {
        getNationalityOptions();
    }, []);
```

### Arays / Datos a renderizar
Todo lo que se pueda mapear, debería ser mapeado. Cercano al código JSX tenemos los arreglos y/o datos que iteramos y renderizamos.

```javascript
    const inputs = [
        {
            show: true,
            id: "name",
            label: t(`host.name`),
            value: formValues.name,
            error: !!errors.name,
            helperText: errors.name,
        },
        {
            show: true,
            id: "lastname",
            label: t(`host.lastname`),
            value: formValues.last_name,
            onChange: e => setLastname(e.target.value),
            error: !!errors.last_name,
            helperText: errors.last_name,
        },
        {
            show: Boolean(isCompany),
            id: "company",
            label: t(`host.email`),
            value: formValues.email,
            onChange: e => setEmail(e.target.value),
            error: !!errors.email,
            helperText: errors.email,
        }
    ];
```

### Mediaquerys y Styles
useStyles recibe argumentos que (en la hoja de estilos) podemos usar para condicionar estilos.
Estos argumentos deberían ir inmediatamente antes de la llamada a useStyles.
Los estilos destructurados nos permiten saber cuáles están en uso y evitar código innecesario en el bundle.

Nombrar los estilos con un guión bajo como prefijo, nos permite identificar rápidamente qué es un estilo y qué es una variable.

Es recomendable manejar desde la hoja de estilos todo lo que se pueda manejar desde la hoja de estilos.
```javascript
    const isMobile = useMediaQuery({ query: '(max-width: 600px)' });

    const {
        _root,
        _subtitle,
        _contact,
        _container,
        _hostSection,
        _link,
    } = useStyles({ isMobile });
```


### Early Return
Siempre que la UI lo permita, de esta manera nos ahorramos la primer capa de ternarios en el componente.
```javascript
        if (loading) return <Loader size={20} />
        if (error) return <ErrorScreen error={errCode} />
```

### Código JSX
Sin estilos en línea. Sin escatimar saltos de línea. Componentizando lo que amerite.
```javascript
        return (
        <Box className={_root}>
            <Box className={_subtitle}>{t('home.contactUs')}</Box>
            <Box className={_contact}>{t('home.willContactYou')}</Box>

            <Box className={_container}>
                {inputs.map((input) => input.show && (
                    <FormControl>
                        <TextField
                            id={input.id}
                            label={input.label}
                            value={input.value}
                            onChange={input.onChange}
                            required={true}
                            style={input.style}
                            error={input.error}
                            helperText={input.helperText}
                            variant={'outlined'}
                            type={'text'}
                            InputLabelProps={{ shrink: true, }}
                        />
                    </FormControl>
                ))}

                <CountrySelectInput countries={countryOptions} />
            </Box>

            <Box className={_hostSection}>
                <FormControl>
                    <FormControlLabel
                        control={
                            <Checkbox
                                onChange={e => setTermsAccepted(e.target.checked)}
                                checked={termsAccepted}
                            />
                        }
                        label={
                            <Box>
                                <Typography>{t(`host.agreeWith`)} </Typography>
                                <Link to="/privacy" target="_blank" className={_link}>{t(`footer.privacy`)}</Link>.
                            </Box>
                        } />
                </FormControl>

                <Button
                    id="gaContacto"
                    disabled={sending || sent || !termsAccepted}
                    onClick={handleSend}
                    style={_button}
                >
                    {submitStatus === SubmitStatusEnum.SENDING
                        ? <CircularProgress />
                        : t('home.send')
                    }
                </Button>
            </Box>
        </Box>
    );
};
```

### Variables auxiliares y Enums
```javascript
const initialFormValues = {
    name: '',
    last_name: '',
    country: '',
    company: '',
    email: '',
};

const SubmitStatusEnum = {
    IDLE: null,
    SENDING: 'SENDING',
    SENT: 'SENT',
    ERROR: 'ERROR',
};
```

### Funciones auxiliares inherentes al componente, pero que no tienen razón de estar dentro
```javascript
const validateFormData = () => {
    let errorsAcum = {};
    if (!formValues.name) errorsAcum.name = t(`errors.requiredFiled`);
    if (!formValues.last_name) errorsAcum.last_name = t(`errors.requiredFiled`);
    if (!formValues.country) errorsAcum.country = t(`errors.requiredFiled`);
    if (isCompany && !formValues.company) errorsAcum.company = t(`errors.requiredFiled`);

    if (!email) errorsAcum.email = t(`errors.requiredFiled`);
    else if (is.not.email(email)) errorsAcum.email = t(`errors.invalidEmail`);

    return errorsAcum;
};
```

### Tipado de props, props por default y export
```javascript
GoodComponent.PropTypes = {
    isCompany: PropTypes.bool,
    width: PropTypes.number,
    afterSentFn: PropTypes.func,
}

GoodComponent.defaultProps = {
    isCompany: false,
    width: 100,
    afterSentFn: () => null
}

export default ContactForm;
```

