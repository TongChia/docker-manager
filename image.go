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

func (a *App) ImageOne(id string) (*image.InspectResponse, error) {
	r, err := a.cli.ImageInspect(a.ctx, id)
	if err != nil {
		return nil, err
	}

	return &r.InspectResponse, nil
}

func (a *App) ImageFiles(id string) (err error) {

	return err
}
