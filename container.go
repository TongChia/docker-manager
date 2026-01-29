package main

import (
	"archive/tar"
	"errors"
	"fmt"
	"io"
	"os/exec"
	"path"
	"strings"

	"github.com/moby/moby/api/types/container"
	"github.com/moby/moby/client"
	ocispec "github.com/opencontainers/image-spec/specs-go/v1"
	"github.com/samber/lo"
	"github.com/samber/ro"
	rostdio "github.com/samber/ro/plugins/stdio"
	"github.com/wailsapp/wails/v3/pkg/application"
)

// ContainerList 容器列表
func (a *App) ContainerList() ([]container.Summary, error) {
	r, err := a.cli.ContainerList(a.ctx, client.ContainerListOptions{All: true})
	if err != nil {
		a.log.Error(err.Error())
		return nil, err
	}

	return r.Items, nil
}

// ContainerById 容器
func (a *App) ContainerById(Id string) (*container.Summary, error) {
	r, err := a.cli.ContainerList(a.ctx, client.ContainerListOptions{
		All:     true,
		Filters: make(client.Filters).Add("id", Id),
	})
	if err != nil {
		a.log.Error(err.Error())
		return nil, err
	}

	return &r.Items[0], nil
}

// ContainerLogs 容器日志
func (a *App) ContainerLogs(cont string) ([]string, error) {
	logio, err := a.cli.ContainerLogs(a.ctx, cont, client.ContainerLogsOptions{
		ShowStdout: true,
		ShowStderr: true,
		Timestamps: false,
		Follow:     false,
		Tail:       "1000",
		Details:    true,
	})
	if err != nil {
		return nil, err
	}

	//ro.Pipe[[]byte, []byte](
	//	rostdio.NewIOReaderLine(logio),
	//	ro.ConcatAll[[]byte](),
	//).SubscribeWithContext(a.ctx, ro.OnNext(func(line []byte) {
	//
	//}))

	result := make([]string, 0)

	rostdio.NewIOReaderLine(logio).SubscribeWithContext(a.ctx, ro.OnNext(func(line []byte) {
		// TODO: line[8:] 前 8 个字节用来区分 Stdout 或 Stderr
		result = append(result, string(line[8:]))
	}))

	return result, nil
}

func (a *App) StopContainer(containerIds []string) error {
	_ = lo.Map(containerIds, func(containerId string, i int) error {
		_, err := a.cli.ContainerKill(a.ctx, containerId, client.ContainerKillOptions{})
		return err
	})
	return nil
}

func (a *App) StartContainer(containerIds []string) error {
	errs := lo.Map(containerIds, func(containerId string, i int) error {
		_, err := a.cli.ContainerStart(a.ctx, containerId, client.ContainerStartOptions{})
		return err
	})
	a.log.Debug(fmt.Sprintf("Start containers %v %v", containerIds, errs))
	return errors.Join(errs...)
}

func (a *App) OpenFolder(path string) error {
	// TODO: test Windows / Linux ?
	info := a.app.Env.Info()

	cmd := &exec.Cmd{}
	if info.OS == "darwin" {
		cmd = exec.Command("open", path)
	}
	if info.OS == "windows" {
		cmd = exec.Command("explorer", path)
	}
	err := cmd.Run()
	return err
}

func (a *App) Mount(cont string) (*client.ContainerInspectResult, error) {

	inspect, err := a.cli.ContainerInspect(a.ctx, cont, client.ContainerInspectOptions{Size: false})
	if err != nil {
		return nil, err
	}

	//root := inspect.Container.Storage.RootFS
	//a.log.Debug("container rootfs", "root", root)

	return &inspect, nil
}

//type FileInfo struct {
//	Name    string      // 文件名
//	Path    string      // 路径
//	Size    int64       // 文件大小（目录为 0）
//	Mode    fs.FileMode // Type flag
//	ModTime int64       // 修改时间（Unix 纳秒）
//	Files   []*FileInfo
//	//Mode     int64       // 文件模式（权限 + 类型）
//	//isDar  bool        // 是否为目录
//}

func (a *App) ContainerFiles(cont string) (*FileNode, error) {
	l := a.log.WithGroup("ContainerFiles")
	r, err := a.cli.CopyFromContainer(a.ctx, cont, client.CopyFromContainerOptions{SourcePath: "/"})
	if err != nil {
		return nil, err
	}
	defer func() {
		if err := r.Content.Close(); err != nil {
			l.Error("failed to close container tar reader", "err", err)
		}
	}()
	tarReader := tar.NewReader(r.Content)

	var filesTree = make(map[string]*FileNode)
	var rootFiles *FileNode = nil
	//var count int = 0

	for {
		//if count > 100 {
		//	break
		//}
		//count++
		header, err := tarReader.Next()
		if err == io.EOF {
			break // 列表结束
		}
		if err != nil {
			return nil, fmt.Errorf("tar read error: %w", err)
		}

		isDar := header.Typeflag == tar.TypeDir
		fsInfo := header.FileInfo()
		filePath, baseName := path.Split(path.Clean(header.Name))

		info := &FileNode{
			Name:     baseName,
			Path:     filePath,
			Size:     header.Size,
			TypeFlag: header.Typeflag,
			Linkname: header.Linkname,
			Mode:     fsInfo.Mode(),
			ModTime:  header.ModTime.UnixMilli(),
			IsDir:    fsInfo.IsDir(),
		}

		if rootFiles == nil {
			rootFiles = info
			filesTree[header.Name] = info
			continue
		}

		if isDar {
			info.Children = make([]*FileNode, 0)
			filesTree[header.Name] = info
		}

		if parentNode, ok := filesTree[filePath]; ok {
			parentNode.Children = append(parentNode.Children, info)
		}
	}

	return rootFiles, nil
}

func (a *App) CreateContainerDialog(actionId string) bool {
	if a.dialog != nil {
		a.dialog.Show()
	}
	dialog := a.app.Window.NewWithOptions(application.WebviewWindowOptions{
		Name:        fmt.Sprintf("Create Container (%s)", actionId),
		Title:       "Create Container",
		Width:       460,
		Height:      815,
		AlwaysOnTop: true,
		Frameless:   true,
		Hidden:      true,
	})

	// Pass message to dialog
	//dialog.OnReady(func() {
	//	dialog.EmitEvent("set-message", message)
	//})

	a.app.Event.On("dialog:CreateContainerDialog:close", func(e *application.CustomEvent) {
		dialog.Close()
	})
	dialog.SetURL("wails://localhost:9245/nested/create_container/index.html")
	dialog.Show()

	a.dialog = dialog
	return true
}

type CreateContainerParams struct {
	Name       string `json:"name"`
	Image      string `json:"image"`
	Platform   string `json:"platform"`
	AutoRemove bool   `json:"rm"`
	StartUp    bool   `json:"startUp"`

	RestartPolicy container.RestartPolicyMode `json:"restart"`

	// Payload
	Cmd        string `json:"cmd"`
	Entrypoint string `json:"entrypoint"`
	WorkingDir string `json:"workdir"`

	// Advanced
	Privileged     bool `json:"privileged"`
	ReadonlyRootfs bool `json:"read-only"`
	Init           bool `json:"init"`
}

func (a *App) CreateContainer(params CreateContainerParams) (client.ContainerCreateResult, error) {
	r, err := a.cli.ContainerCreate(a.ctx, client.ContainerCreateOptions{
		Name: params.Name,
		Config: &container.Config{
			ExposedPorts: nil, // TODO
			Env:          nil, // TODO
			Cmd:          splitCmd(params.Cmd),
			Image:        params.Image,
			Volumes:      nil, // TODO
			WorkingDir:   params.WorkingDir,
			Entrypoint:   splitCmd(params.Entrypoint),
		},
		HostConfig: &container.HostConfig{
			PortBindings: nil, // TODO
			RestartPolicy: container.RestartPolicy{
				Name: params.RestartPolicy,
			},
			AutoRemove:     params.AutoRemove,
			Privileged:     params.Privileged,
			ReadonlyRootfs: params.ReadonlyRootfs,
			Init:           &params.Init,
		},
		Platform: &ocispec.Platform{
			Architecture: params.Platform,
			OS:           "linux", // TODO: windows
		},
	})
	if err == nil && params.StartUp {
		_, err := a.cli.ContainerStart(a.ctx, r.ID, client.ContainerStartOptions{})
		if err != nil {
			return r, err

		}
	}
	return r, err
}

func splitCmd(str string) []string {
	if str == "" {
		return nil
	} else {
		return strings.Split(str, " ")
	}
}

func (a *App) RemoveContainer(cont string) error {
	_, err := a.cli.ContainerRemove(a.ctx, cont, client.ContainerRemoveOptions{
		Force: false,
	})
	return err
}
