import { styled } from '@mui/material/styles';
import { findByLabelText } from '@testing-library/react';

export default styled((theme) => ({

    root:{
        padding: theme.spacing(0.5),
        marginTop: '1rem'
    },
    grid:{
        maxWidth: "100%"
    }
}));

