# Multi Track Timeline

<!-- ## Getting Started

Mutti exports web components that can either be installed locally or included through a CDN, such as [esm.sh](https://esm.sh) directly.

```bash
npm i @holisticon/mutti
```

After importing the package, the web components can be used in your page markup. -->

## Usage Example

```html
<mutti-timeline lang="de">
	<mutti-track>
		<mutti-label>Track Name</mutti-label>
		<mutti-item start="2020-08-01" end="2021-01-01" scale="0.5"
			>Item Content</mutti-item
		>
		<mutti-item start="2021-08-14" end="2022-03-05">Item Content</mutti-item>
		<mutti-item start="2022-04-01" end="2022-04-02">Item Content</mutti-item>
	</mutti-track>
	<mutti-track>
		<mutti-label>Track Name</mutti-label>
		<mutti-item start="2020-08-01" end="2021-01-01">Item Content</mutti-item>
		<mutti-item start="2021-08-14" end="2022-03-05" scale="0.7"
			>Item Content</mutti-item
		>
		<mutti-item start="2022-04-01" end="2022-04-02">Item Content</mutti-item>
	</mutti-track>
</mutti-timeline>
```

## Contributing

- Clone the repo and run `npm ci`
- Running an example:
  - Run `npm start` and `npm run serve:watch`
  - Open http://localhost:9000/examples/random.html in your browser.
- Execute tests with `npm test`
