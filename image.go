package main

import (
	"fmt"
	"io/fs"

	"github.com/moby/moby/api/types/image"
	"github.com/moby/moby/client"
	"github.com/wagoodman/dive/dive/filetree"
	dive_image "github.com/wagoodman/dive/dive/image"
	dive_image_docker "github.com/wagoodman/dive/dive/image/docker"
)

func (a *App) ImageList() (*client.ImagesDiskUsage, error) {
	usages, err := a.cli.DiskUsage(a.ctx, client.DiskUsageOptions{
		Images:  true,
		Verbose: true,
	})
	if err != nil {
		return nil, err
	}

	a.log.Debug("got images disk", "usages", usages.Images)

	return &usages.Images, nil
}

func (a *App) ImageOne(id string) (*image.InspectResponse, error) {
	r, err := a.cli.ImageInspect(a.ctx, id)
	if err != nil {
		return nil, err
	}

	return &r.InspectResponse, nil
}

// FileNode filetree.FileNode 有循环嵌套结构，不利于传输。
type FileNode struct {
	Name     string            `json:"n"`
	Path     string            `json:"p"`
	Size     int64             `json:"s"`
	TypeFlag byte              `json:"t"`
	Linkname string            `json:"l"`
	Mode     fs.FileMode       `json:"m"`
	ModTime  int64             `json:"mod"`
	IsDir    bool              `json:"dir"`
	DiffType filetree.DiffType `json:"diff"`
	Children []*FileNode       `json:"child"`
}

func formatFileNode(node *filetree.FileNode) *FileNode {
	if node == nil {
		return nil
	}
	if node.Data.DiffType != filetree.Unmodified {
		fmt.Printf("Unmodified file: %+v \n", node)
	}
	r := &FileNode{
		Name:     node.Name,
		Path:     node.Path(),
		Size:     node.Data.FileInfo.Size,
		TypeFlag: node.Data.FileInfo.TypeFlag,
		Linkname: node.Data.FileInfo.Linkname,
		Mode:     node.Data.FileInfo.Mode,
		ModTime:  0,
		IsDir:    node.Data.FileInfo.IsDir,
		DiffType: node.Data.DiffType,
		Children: make([]*FileNode, 0),
	}
	for _, c := range node.Children {
		r.Children = append(r.Children, formatFileNode(c))
	}
	return r
}

type Layer struct {
	Id      string
	Index   int
	Command string
	Size    uint64
	Tree    *FileNode
	Names   []string
	Digest  string
}

func formatLayer(layer *dive_image.Layer, _ int) *Layer {
	return &Layer{
		Id:      layer.Id,
		Index:   layer.Index,
		Command: layer.Command,
		Size:    layer.Size,
		Tree:    formatFileNode(layer.Tree.Root),
		Names:   layer.Names,
		Digest:  layer.Digest,
	}
}

func (a *App) ImageFilesDive(image string) ([]*Layer, error) {
	saveReader, err := a.cli.ImageSave(a.ctx, []string{image})
	if err != nil {
		return nil, err
	}
	defer saveReader.Close()

	archive, err := dive_image_docker.NewImageArchive(saveReader)
	if err != nil {
		return nil, err
	}

	img, err := archive.ToImage()
	if err != nil {
		return nil, err
	}

	var layers = make([]*Layer, 0)
	//var _layer *dive_image.Layer
	for i, layer := range img.Layers {
		if i > 0 {
			tree := img.Layers[i-1].Tree.Copy()
			// TODO: 不可靠
			_, _ = tree.CompareAndMark(layer.Tree)
			layers = append(layers, &Layer{
				Id:      layer.Id,
				Index:   layer.Index,
				Command: layer.Command,
				Size:    layer.Size,
				Tree:    formatFileNode(tree.Root),
				Names:   layer.Names,
				Digest:  layer.Digest,
			})
		} else {
			layers = append(layers, formatLayer(layer, i))
		}
	}

	return layers, nil
}
