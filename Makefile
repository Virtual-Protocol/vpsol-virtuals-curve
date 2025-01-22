make:
	wasm-pack build --out-dir pkg --release --target nodejs && rm -f pkg/README.md pkg/.gitignore && mv pkg/* . && rm -rf pkg