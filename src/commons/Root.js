import React from "react";
import Header from "./Header";

function Root({showBack, children}) {
	return (
		<div>
			<Header showBack={showBack} />
			<main>{children}</main>
		</div>
	);
}

export default Root;
