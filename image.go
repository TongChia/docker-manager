package main

import (
	"github.com/moby/moby/api/types/image"
	"github.com/moby/moby/client"
)

func (a *App) ImageList() ([]image.Summary, error) {
	images, err := a.cli.ImageList(a.ctx, client.ImageListOptions{All: true})
	if err != nil {
		a.log.Error("Failed to list images: " + err.Error())
		return nil, err
	}

	return images.Items, nil
}
