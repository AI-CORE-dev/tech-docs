// External Components
import React, { useEffect, useState } from "react";
import { Box, Button, Checkbox, CircularProgress, FormControl, FormControlLabel, TextField } from "@material-ui/core";

// Utils & Config
import is from "is_js";
import PropTypes from 'prop-types';
import { t } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import DataService from "../services/DataService";

// Internal Components
import { Link } from "react-router-dom";

// Icons & Images
const someImage = require('../../images/someImage.png');

const ContactForm = (props) => {

    const { isCompany, width, afterSentFn } = props;

    // UI States
    const [formValues, setFormValues] = useState(initialFormValues);
    const [submitStatus, setSubmitStatus] = useState(SubmitStatusEnum.IDLE);
    const [errors, setErrors] = useState({});

    // Data States
    const [countryOptions, setCountryOptions] = useState([]);

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

    useEffect(() => {
        getNationalityOptions();
    }, []);

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

    const isMobile = useMediaQuery({ query: '(max-width: 600px)' });

    const {
        _root,
        _subtitle,
        _contact,
        _container,
        _hostSection,
        _link,
    } = useStyles({ isMobile });

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
