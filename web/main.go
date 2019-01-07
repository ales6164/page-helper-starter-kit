package web

import (
	"github.com/ales6164/pages"
	"net/http"
)

func init() {
	page, err := pages.New(&pages.Options{
		JsonFilePath: "dist/manifest.json",
		ForceSSL:     true,
	})
	if err != nil {
		panic(err)
	}

	router, err := page.BuildRouter()
	if err != nil {
		panic(err)
	}

	http.Handle("/", router)
}
