import React from "react";
import Header from "./Header";

function Root(props) {
    return (
        <div>
            <Header />
            <main>{props.children}</main>
        </div>
    );
}

export default Root;
