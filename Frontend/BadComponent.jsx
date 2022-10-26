import { Box, Button, Checkbox, CircularProgress, FormControl, FormControlLabel, FormHelperText, InputBase, InputLabel, MenuItem, Select, TextField, withStyles } from "@material-ui/core";
import is from "is_js";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import DataService from "../services/DataService";
import ReactCountryFlag from "react-country-flag"
import { Link } from "react-router-dom";

const ContactForm = ({ isCompany = false, width, afterSentFn = () => null }) => {
    const { t } = useTranslation();
    const isMobile = useMediaQuery({ query: '(max-width: 600px)' });

    const [name, setName] = useState('');
    const [last_name, setLastname] = useState('');
    const [country, setCountry] = useState('');
    const [company, setCompany] = useState('');
    const [email, setEmail] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);

    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    const [countryOptions, setCountryOptions] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        let mounted = true;
        const getNationalityOptions = async () => {
            let resp = await DataService.getNationalities();
            mounted && setCountryOptions(resp.data);
        }
        getNationalityOptions();
        return () => mounted = false;
    }, []);

    const validateFormData = () => {
        let errorsAcum = {};
        if (is.empty(name)) errorsAcum.name = t(`errors.requiredFiled`);
        if (is.empty(last_name)) errorsAcum.last_name = t(`errors.requiredFiled`);
        if (is.empty(country)) errorsAcum.country = t(`errors.requiredFiled`);
        if (isCompany && is.empty(company)) errorsAcum.company = t(`errors.requiredFiled`);

        if (is.empty(email))
            errorsAcum.email = t(`errors.requiredFiled`);
        else if (is.not.email(email))
            errorsAcum.email = t(`errors.invalidEmail`);

        let isValid = is.empty(errorsAcum);
        setErrors(errorsAcum);
        return isValid;
    }

    const send = () => {
        setSending(true);
        DataService.sendCompanyContactEmail({
            name,
            last_name,
            country: t(`data.countries.${country}`),
            company,
            email,
            isCompany
        }).then(resp => {
            setSending(false);
            setSent(true);
            setName('');
            setLastname('');
            setCountry('');
            setCompany('');
            setEmail('');
            setTimeout(() => setSent(false), 1500);
            afterSentFn();
        }).catch(e => {
            console.log(e);
            setSending(false);
        });

        window.gtag('event', 'submit', {
            'event_category': 'form',
            'event_label': `contact_form_${isCompany ? 'company' : 'host'}`,
        });
    }

    return (
        // <Box style={{ width: width ? width : (isMobile ? '90%' : '50%'), display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
        <Box style={{ width: width ? width : (isMobile ? '90%' : '50%'), display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
            <Box style={{ fontSize: 24, fontWeight: 600, textTransform: 'capitalize', marginBottom: 15 }}>{t('home.contactUs')}</Box>
            <Box style={{ fontSize: 16, fontWeight: 600, color: 'grey', marginBottom: 15, alignSelf: 'flex-start', marginLeft: 15 }}>{t('home.willContactYou')}</Box>

            <Box style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <FormControl style={{ padding: '10px' }}>
                    <TextField
                        id="name"
                        label={t(`host.name`)}
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                        variant="outlined"
                        style={{ backgroundColor: '#ffffff' }}
                        error={!!errors.name}
                        helperText={errors.name}
                        type="text"
                        InputLabelProps={{ shrink: true, }} />
                </FormControl>

                <FormControl style={{ padding: '10px' }}>
                    <TextField
                        id="lastname"
                        label={t(`host.lastname`)}
                        value={last_name}
                        onChange={e => setLastname(e.target.value)}
                        required
                        variant="outlined"
                        style={{ backgroundColor: '#ffffff' }}
                        error={!!errors.last_name}
                        helperText={errors.last_name}
                        type="text"
                        InputLabelProps={{ shrink: true, }} />
                </FormControl>

                <FormControl style={{ padding: '10px' }}>
                    <TextField
                        id="company"
                        label={t(`host.email`)}
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        variant="outlined"
                        style={{ backgroundColor: '#ffffff' }}
                        error={!!errors.email}
                        helperText={errors.email}
                        type="text"
                        InputLabelProps={{ shrink: true, }} />
                </FormControl>

                {isCompany && <FormControl style={{ padding: '10px' }}>
                    <TextField
                        id="company"
                        label={t(`company.company`)}
                        value={company}
                        required
                        variant="outlined"
                        style={{ backgroundColor: '#ffffff' }}
                        onChange={e => setCompany(e.target.value)}
                        error={!!errors.company}
                        helperText={errors.company}
                        type="text"
                        InputLabelProps={{ shrink: true, }} />
                </FormControl>}

                <FormControl style={{ padding: '10px' }} error={!!errors.country} variant="outlined" >
                    <InputLabel shrink id="country-label" style={{ marginLeft: '8px', marginTop: '9px', backgroundColor: 'white', paddingLeft: 4, paddingRight: 4 }}>{t(`company.country`)} *</InputLabel>
                    <Select
                        labelId="country-label"
                        id="country"
                        value={country}
                        onChange={e => setCountry(e.target.value)}
                        required
                        style={{ backgroundColor: '#ffffff' }}
                        label={t(`company.country`)}>
                        {countryOptions.sort((a, b) => a.order - b.order).map(no => <MenuItem key={no.id + '_nation'} value={no.name}>
                            <Box style={{ display: 'flex', alignItems: 'center' }}>
                                <ReactCountryFlag svg countryCode={no.name || ''} style={{ marginLeft: 5, width: 32, height: 32 }} />
                                <Box style={{ marginLeft: 20 }}>{t(`data.countries.${no.name}`)}</Box>
                            </Box>
                        </MenuItem>)}
                    </Select>
                    <FormHelperText>{errors.country}</FormHelperText>
                </FormControl>
            </Box>
            <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }} className="hostSection">
                <FormControl style={{ padding: 10 }}>
                    <FormControlLabel
                        control={<Checkbox
                            onChange={e => setTermsAccepted(e.target.checked)}
                            checked={termsAccepted} />}
                        label={
                            <div style={{ color: '#383839', textAlign: 'left' }}>
                                <span>{t(`host.agreeWith`)} </span>
                                <Link to="/privacy" target="_blank" style={{ color: '#00D1BF', textDecoration: 'none' }}>{t(`footer.privacy`)}</Link>.
                            </div>
                        } />
                </FormControl>
                <Button
                    id="gaContacto"
                    disabled={sending || sent || !termsAccepted}
                    onClick={() => validateFormData() && send()}
                    style={{
                        backgroundColor: '#00D1BF',
                        color: '#ffffff',
                        fontFamily: 'Poppins',
                        opacity: termsAccepted ? 1 : 0.5,
                        borderRadius: '10px',
                        boxShadow: 'none',
                        width: '150px',
                        height: '40px',
                        fontWeight: 'bold',
                        margin: "24px 0 30px 0"
                    }}>
                    {sending ? <CircularProgress /> : (sent ? t('home.sent') : t('home.send'))}
                </Button>
            </Box>
        </Box>
    );
}

export default ContactForm;

const CountryInputBase = withStyles((theme) => ({
    root: {
        'label + &': {
            marginTop: '14px',
        },
        '& label': {
            color: 'red',
        }
    },
    input: {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: '#ffffff',
        border: '1px solid #ced4da',
        fontSize: 16,
        padding: '10px 26px 10px 12px',
        position: 'relative',
    },
}))(InputBase);
