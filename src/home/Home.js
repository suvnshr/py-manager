import React from "react";
import { TextField, Grid } from "@material-ui/core";

function Home() {
    return (
        <div>
            <p />

            <Grid container>
                <Grid item md={3} lg={4} />
                <Grid item xs={12} md={6} lg={4}>
                    <TextField
                        fullWidth={true}
                        label="Search local packages..."
                        variant="outlined"
                    />
                </Grid>
            </Grid>
        </div>
    );
}

export default Home;
