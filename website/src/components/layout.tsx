import React from "react"
import { GlobalStyles } from "twin.macro"
import { MDXProvider, MDXProviderComponents } from "@mdx-js/react"

const components: MDXProviderComponents = {}

const Layout = ({ children }: { children: React.ReactNode }) => (
	<div>
		<GlobalStyles />

		<MDXProvider components={components}>{children}</MDXProvider>
	</div>
)

export default Layout
