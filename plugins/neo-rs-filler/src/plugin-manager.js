(self.webpackChunkmfe_nwc_plugin_manager = self.webpackChunkmfe_nwc_plugin_manager || []).push([[956], {
    72956: (e, n, i) => {
        i.d(n, {
            Z: () => G
        });
        var t = i(47474)
          , l = i(37900)
          , r = i.n(l)
          , a = i(6804)
          , o = i(93411)
          , s = i(52322);
        const d = () => {
            const {t: e} = (0,
            o.$G)("pluginManager");
            return (0,
            s.jsxs)(s.Fragment, {
                children: [(0,
                s.jsx)(o.cC, {
                    i18nKey: "plugins.header.infoText",
                    t: e,
                    components: [(0,
                    s.jsxs)("a", {
                        href: "https://help.nintex.com/en-US/formplugins/Home.htm",
                        target: "_blank",
                        rel: "noreferrer",
                        children: [e("plugins.header.infoLinkText"), (0,
                        s.jsx)("div", {
                            className: "nx-btn-icon-wrapper nx-btn-icon-wrapper-right",
                            children: (0,
                            s.jsx)(t.SvgIcon, {
                                icon: "open-in-a-new-window",
                                width: "36",
                                height: "36"
                            })
                        })]
                    })]
                }), (0,
                s.jsxs)("div", {
                    children: [(0,
                    s.jsx)("br", {}), (0,
                    s.jsx)(o.cC, {
                        i18nKey: "plugins.header.termsText",
                        t: e,
                        components: [(0,
                        s.jsxs)("a", {
                            href: "https://www.nintex.com/legal/subscription-support-policy/",
                            target: "_blank",
                            rel: "noreferrer",
                            children: [e("plugins.header.termsLinkText"), (0,
                            s.jsx)("div", {
                                className: "nx-btn-icon-wrapper nx-btn-icon-wrapper-right",
                                children: (0,
                                s.jsx)(t.SvgIcon, {
                                    icon: "open-in-a-new-window",
                                    width: "36",
                                    height: "36"
                                })
                            })]
                        })]
                    })]
                })]
            })
        }
          , u = ({isReadOnlyView: e=!1}) => {
            const {t: n} = (0,
            o.$G)("pluginManager");
            return (0,
            s.jsx)("div", {
                className: "plugin-header",
                children: (0,
                s.jsx)("div", {
                    className: "plugin-info",
                    children: (0,
                    s.jsxs)("div", {
                        "data-test-id": "nx-plugin-header-text",
                        children: [n("plugins.list.formsText"), e ? n("plugins.header.readOnlyHeading") : (0,
                        s.jsx)(d, {})]
                    })
                })
            })
        }
          , c = ({value: e, isNew: n, onClick: i}) => (0,
        s.jsxs)("td", {
            "data-test-id": `table-title-${e}`,
            children: [n ? (0,
            s.jsx)("div", {
                className: "flagged-tag",
                "data-test-id": `${e}-success-flag`,
                children: (0,
                s.jsx)(t.Flag, {
                    type: t.FLAG_TYPE.SUCCESS
                })
            }) : null, (0,
            s.jsx)("button", {
                className: "btn btn-link",
                onClick: i,
                children: e
            })]
        });
        var g = i(22430);
        const m = e => (0,
        s.jsx)("td", {
            children: e && (0,
            s.jsx)(t.Badge, {
                className: "font-weight-normal",
                size: "medium",
                inverse: !0,
                type: e.isDisabled ? "dark" : "success",
                children: e.value
            })
        })
          , p = ({plugins: e, loading: n, loadingError: i, setSelectedRowMeatball: r, tableColumns: a, handleEnablePlugin: d, onDialogAction: u}) => {
            const {t: p} = (0,
            o.$G)("pluginManager")
              , [f,h] = (0,
            l.useState)("createdDate")
              , [b,v] = (0,
            l.useState)(t.TABLE_SORT_ORDER.DESC)
              , [x,N] = (0,
            l.useState)([])
              , y = (0,
            l.useCallback)(( (n, i, l=!1) => {
                const r = i || e
                  , a = f === n && b === t.TABLE_SORT_ORDER.ASC ? t.TABLE_SORT_ORDER.DESC : t.TABLE_SORT_ORDER.ASC
                  , o = i ? b : a
                  , s = (0,
                g.Z)(r, [{
                    controlName: e => {
                        var n;
                        return null == (n = e.controlName) || null == (n = n.value) ? void 0 : n.toLowerCase()
                    }
                    ,
                    createdDate: e => e.createdDate.value.toLowerCase(),
                    createdBy: e => e.createdBy.toLowerCase(),
                    hostedBy: e => e.hostedBy.value.toLowerCase(),
                    status: e => {
                        var n;
                        return null == (n = e.status) ? void 0 : n.value.toLowerCase()
                    }
                    ,
                    groupName: e => {
                        var n;
                        return null == (n = e.groupName) ? void 0 : n.toLowerCase()
                    }
                }[n]], o === t.TABLE_SORT_ORDER.DESC ? ["desc"] : []);
                N(l ? s : s.map((e => Object.assign({}, e, {
                    controlName: Object.assign({}, e.controlName, {
                        isNew: !1
                    })
                })))),
                h(n),
                v(o)
            }
            ), [e, f, b]);
            return (0,
            l.useEffect)(( () => {
                y(f, e, !0)
            }
            ), [y, e, f, a]),
            (0,
            s.jsx)(t.Table, {
                className: "nx-plugin-list",
                noResults: i || p("plugins.list.notAvailable"),
                customComponents: {
                    name: c,
                    date: t.DateCell,
                    status: m
                },
                hasCommands: !0,
                data: x,
                loading: n,
                columns: a,
                sortedColumn: f,
                sortedDirection: b,
                onSortColumn: y,
                onActionCommand: ({command: e, row: n}) => {
                    "sourceUrl" === e && n.sourceUrl && window.open(n.sourceUrl, "_blank", "noopener,noreferrer"),
                    "delete" !== e && "disable" !== e || (u(e, n),
                    r(n.id)),
                    "enable" === e && d(n)
                }
                ,
                htmlDataTestId: "form-plugins-list-table"
            })
        }
        ;
        var f = i(63955);
        const h = /https:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/
          , b = /^([a-z][a-z0-9]*)(-[a-z0-9]+)*$/
          , v = /^(?!nintex-|ntx-|nwc-|nac-)/
          , x = r().forwardRef(( (e, n) => (0,
        s.jsx)(t.TextArea, Object.assign({}, e))))
          , N = ({displayMode: e}) => {
            const {register: n, control: i, formState: {errors: l}} = (0,
            f.Gc)()
              , r = (0,
            f.qo)({
                name: "hostedBy"
            })
              , {t: a} = (0,
            o.$G)("pluginManager")
              , d = a("plugins.errors.input.invalidElementName", {
                input: a("plugins.form.input.elementName")
            })
              , u = a("plugins.errors.input.invalidPrefix");
            return (0,
            s.jsxs)("div", {
                className: "nx-form",
                children: [(0,
                s.jsx)("div", {
                    "data-test-id": "nx-plugin-form-group-input-hosted-by",
                    className: "form-group",
                    children: (0,
                    s.jsx)(f.Qr, {
                        name: "hostedBy",
                        control: i,
                        defaultValue: "file",
                        render: ({field: n}) => (0,
                        s.jsxs)(t.SegmentedControl, {
                            name: "option",
                            disabled: e,
                            onChange: e => {
                                n.onChange(e)
                            }
                            ,
                            selected: n.value,
                            children: [(0,
                            s.jsx)(t.SegmentedItem, {
                                value: "file",
                                label: a("general.upload"),
                                disabled: !1
                            }), (0,
                            s.jsx)(t.SegmentedItem, {
                                value: "url",
                                label: a("plugins.form.input.urlOption"),
                                disabled: !1
                            })]
                        })
                    })
                }), "url" === r && (0,
                s.jsxs)("div", {
                    "data-test-id": "nx-plugin-form-group-input-sourceUrl",
                    className: "form-group",
                    children: [(0,
                    s.jsx)("label", {
                        className: "form-control-required",
                        htmlFor: "sourceUrl",
                        children: a("plugins.form.input.sourceUrl")
                    }), (0,
                    s.jsx)(f.Qr, {
                        name: "sourceUrl",
                        rules: {
                            validate: e => !(null == e || !e.trim()) || a("plugins.errors.input.invalidUrl"),
                            pattern: h
                        },
                        control: i,
                        render: ({field: n}) => (0,
                        s.jsx)(t.Input, {
                            type: "url",
                            value: n.value,
                            onChange: n.onChange,
                            error: (null == l ? void 0 : l.sourceUrl) && a("plugins.errors.input.invalidUrl"),
                            disabled: e,
                            id: "sourceUrl",
                            "data-test-id": "nx-plugin-form-input-sourceUrl",
                            "aria-describedby": "sourceUrl",
                            placeholder: "https://"
                        })
                    })]
                }), "url" !== r && (0,
                s.jsxs)("div", {
                    "data-test-id": "nx-plugin-form-group-input-file",
                    className: "form-group",
                    children: [(0,
                    s.jsx)("label", {
                        className: "form-control-required",
                        htmlFor: "controlName",
                        children: a("plugins.form.input.fileLabel")
                    }), (0,
                    s.jsx)(f.Qr, {
                        name: "file",
                        rules: {
                            validate: e => !(null == e || !e.name) || a("plugins.errors.input.invalidFile")
                        },
                        control: i,
                        render: ({field: n}) => {
                            var i, r;
                            return (0,
                            s.jsx)(t.FilePicker, {
                                dropFileLabelText: a("plugins.form.fileUpload.dropFileLabelText"),
                                dragFileLabelText: a("plugins.form.fileUpload.dragFileLabelText"),
                                selectFileButtonText: a("plugins.form.fileUpload.selectFileButtonText"),
                                maxSize: 5242880,
                                file: n.value,
                                readOnly: e,
                                onChange: n.onChange,
                                error: null == l || null == (r = l.file) ? void 0 : r.message,
                                accept: ".js"
                            }, null == (i = n.value) ? void 0 : i.name)
                        }
                    })]
                }), e && (0,
                s.jsxs)("div", {
                    "data-test-id": "nx-plugin-form-group-input-elementName",
                    className: "form-group",
                    children: [(0,
                    s.jsx)("label", {
                        htmlFor: "controlName",
                        children: a("plugins.form.input.controlName")
                    }), (0,
                    s.jsx)(f.Qr, {
                        name: "controlName",
                        control: i,
                        render: ({field: e}) => (0,
                        s.jsx)(t.Input, {
                            value: e.value,
                            disabled: !0,
                            id: "controlName",
                            "data-test-id": "nx-plugin-form-input-controlName",
                            "aria-describedby": "controlName"
                        })
                    })]
                }), (0,
                s.jsxs)("div", {
                    "data-test-id": "nx-plugin-form-group-input-elementName",
                    className: "form-group",
                    children: [(0,
                    s.jsxs)("span", {
                        className: "d-flex align-items-center element-name-label",
                        children: [(0,
                        s.jsx)("label", {
                            className: "form-control-required",
                            htmlFor: "elementName",
                            children: a("plugins.form.input.elementName")
                        }), (0,
                        s.jsx)(t.Tooltip, {
                            placement: "top",
                            title: a("plugins.form.input.elementNameTooltip"),
                            children: (0,
                            s.jsx)(t.SvgIcon, {
                                icon: "information-alt"
                            })
                        })]
                    }), (0,
                    s.jsx)(f.Qr, {
                        name: "elementName",
                        rules: {
                            validate: {
                                emptyValue: e => !(null == e || !e.trim()) || a("plugins.errors.input.invalidValue"),
                                pattern: e => e && b.test(e) || d,
                                prefix: e => e && v.test(e) || u
                            }
                        },
                        control: i,
                        render: ({field: n}) => {
                            var i;
                            return (0,
                            s.jsx)(t.Input, {
                                value: n.value,
                                onChange: n.onChange,
                                error: (null == l ? void 0 : l.elementName) && (null == l || null == (i = l.elementName) ? void 0 : i.message),
                                disabled: e,
                                id: "elementName",
                                "data-test-id": "nx-plugin-form-input-elementName",
                                "aria-describedby": "elementName",
                                placeholder: "e.g. custom-element-name"
                            })
                        }
                    })]
                }), (0,
                s.jsxs)("div", {
                    "data-test-id": "nx-plugin-form-group-input-description",
                    className: "form-group",
                    children: [(0,
                    s.jsx)("label", {
                        htmlFor: "description",
                        children: a("plugins.form.input.description")
                    }), (0,
                    s.jsx)(f.Qr, {
                        name: "description",
                        control: i,
                        render: ({field: i}) => {
                            var t;
                            return (0,
                            s.jsx)(x, Object.assign({}, n("description"), {
                                error: null == l || null == (t = l.description) ? void 0 : t.message,
                                id: "description",
                                "aria-describedby": "description",
                                "data-test-id": "nx-plugin-form-input-description",
                                value: i.value,
                                onChange: i.onChange,
                                disabled: e
                            }))
                        }
                    })]
                })]
            })
        }
          , y = (0,
        l.forwardRef)(( ({title: e, onClose: n, handleSubmit: i, error: l, loading: r, displayMode: a, disableSubmit: d}, u) => {
            const {t: c} = (0,
            o.$G)("pluginManager");
            return (0,
            s.jsxs)("div", {
                className: "nx-config-panel",
                ref: u,
                children: [(0,
                s.jsx)(t.Button, {
                    className: "nx-config-panel-close",
                    icon: "close",
                    "data-role": "close",
                    "aria-label": "close",
                    type: "borderless",
                    onClick: n,
                    "data-test-id": "nx-config-panel-close"
                }), (0,
                s.jsxs)("header", {
                    children: [(0,
                    s.jsx)("div", {
                        className: "nx-side-panel-icon-container",
                        children: (0,
                        s.jsx)(t.SvgIcon, {
                            icon: "plugin",
                            className: "nx-side-panel-icon"
                        })
                    }), (0,
                    s.jsx)("div", {
                        children: (0,
                        s.jsx)("h2", {
                            className: "nx-config-panel-heading",
                            children: e
                        })
                    })]
                }), l && (0,
                s.jsx)(t.Alert, {
                    type: "danger",
                    children: l
                }), (0,
                s.jsx)("form", {
                    className: "nx-plugin-form",
                    onSubmit: i,
                    children: (0,
                    s.jsxs)("div", {
                        className: "nx-plugin-config-container",
                        children: [(0,
                        s.jsx)(N, {
                            displayMode: a
                        }), !a && (0,
                        s.jsxs)("div", {
                            className: "nx-plugin-form-actions",
                            children: [(0,
                            s.jsx)(t.Button, {
                                "data-test-id": "nx-plugin-config-form-cancel",
                                disabled: r,
                                onClick: n,
                                type: "secondary",
                                children: c("general.cancel")
                            }), (0,
                            s.jsx)(t.Button, {
                                "data-test-id": "nx-plugin-config-form-create",
                                disabled: r || d,
                                htmlType: "submit",
                                children: c("plugins.form.actions.addPlugin")
                            })]
                        })]
                    })
                })]
            })
        }
        ))
          , D = r().createContext({})
          , S = () => (0,
        l.useContext)(D);
        var L = i(99479)
          , j = i(77793);
        const w = ({id: e, controlName: n, elementName: i, description: t, sourceUrl: l}) => ({
            pluginId: e,
            controlName: n.value,
            elementName: i,
            description: t,
            sourceUrl: l
        })
          , E = (e, n=!0) => {
            const i = [{
                icon: "open-in-a-new-window",
                title: j.Z.t("general.viewSource"),
                command: "sourceUrl"
            }]
              , t = {
                icon: e.isDisabled ? "enable" : "disable",
                title: e.isDisabled ? j.Z.t("general.enable") : j.Z.t("general.disable"),
                command: e.isDisabled ? "enable" : "disable"
            };
            return i.push(t),
            n || i.push({
                icon: "trash",
                title: j.Z.t("general.delete"),
                command: "delete"
            }),
            i
        }
          , T = e => ({
            controlName: {
                title: e.t("plugins.formTable.control"),
                field: "controlName",
                sortable: !0
            },
            groupName: {
                title: e.t("plugins.formTable.group"),
                field: "groupName",
                sortable: !0
            },
            createdBy: {
                title: e.t("plugins.formTable.createdBy"),
                field: "createdBy",
                sortable: !0
            },
            createdDate: {
                title: e.t("plugins.formTable.createdDate"),
                field: "createdDate",
                sortable: !0
            },
            status: {
                title: e.t("plugins.formTable.status"),
                field: "status",
                sortable: !0
            },
            hostedBy: {
                title: e.t("plugins.formTable.hostedBy"),
                field: "hostedBy",
                sortable: !0
            }
        })
          , P = "/api/v1/plugins"
          , U = (e, n) => `${e}${e.includes("nintex") ? "/forms" : ""}${n}`
          , F = e => 200 === e.status || 201 === e.status ? e.json() : e.text().then((e => {
            try {
                const n = JSON.parse(e);
                return Promise.reject(n)
            } catch (e) {
                throw new Error(j.Z.t("plugins.errors.api.connectionError"))
            }
        }
        ))
          , C = (e, n) => "file" === e.hostedBy && e.file ? ( (e, n) => e.getTokenAsync().then((i => {
            if (!i)
                throw Error(j.Z.t("plugins.errors.api.tokenError"));
            if (!n.file)
                throw Error(j.Z.t("plugins.errors.api.fileNotFound"));
            const t = new Headers;
            t.append("Authorization", `Bearer ${i}`);
            const l = new FormData
              , r = n.file;
            return l.append("file", r, r.name),
            l.append("elementName", n.elementName),
            l.append("description", n.description),
            l.append("contract", JSON.stringify(n.contract)),
            fetch(U(e.apiBaseUrl, `${P}/upload`), {
                method: "POST",
                headers: t,
                body: l
            })
        }
        )).then((e => F(e))).catch((e => {
            throw console.error(e),
            e
        }
        )))(n, e) : ( (e, n) => e.getTokenAsync().then((i => {
            if (!i)
                throw Error(j.Z.t("plugins.errors.api.tokenError"));
            return fetch(U(e.apiBaseUrl, P), {
                method: "POST",
                headers: {
                    authorization: `Bearer ${i}`,
                    "Content-Type": "application/json"
                },
                body: n ? JSON.stringify(n) : null
            })
        }
        )).then((e => F(e))).catch((e => {
            throw console.error(e),
            e
        }
        )))(n, e)
          , k = (e, n, i={}, t={}) => {
            const l = (null != n ? n : document).createElement(e);
            if (i)
                for (const e of Object.keys(i))
                    l[e] = i[e];
            if (t)
                for (const e of Object.keys(t))
                    l.style[e] = t[e];
            return l
        }
          , A = e => {
            var n;
            const i = null == (n = document) ? void 0 : n.getElementById(e);
            null !== i && i.remove()
        }
          , B = async e => {
            const n = `script-iframe-${e.elementName}`;
            try {
                let i = "";
                if ("file" === e.hostedBy && e.file) {
                    const n = new FileReader
                      , t = await ( (e, n) => new Promise(( (i, t) => {
                        n.onload = () => {
                            "string" == typeof n.result ? i(n.result) : t(new Error(j.Z.t("plugins.errors.api.fileError")))
                        }
                        ,
                        n.onerror = () => {
                            t(n.error)
                        }
                        ,
                        n.readAsText(e)
                    }
                    )))(e.file, n);
                    i = URL.createObjectURL(new Blob([t],{
                        type: "text/javascript"
                    }))
                } else
                    i = e.sourceUrl;
                const t = (e => {
                    var n;
                    A(e);
                    const i = document.createElement("iframe");
                    return i.id = e,
                    null != (n = i.contentDocument) ? n : void 0
                }
                )(n);
                await ( (e, n="", i, t=!0, l=!0) => new Promise(( (t, l) => {
                    setTimeout(( () => {
                        try {
                            ( (e, n="", i, t=!0, l=!0, r=(n => console.debug(`Script loaded: ${e}`, n)), a=(n => console.error(`Script error: ${e}`, n))) => {
                                const o = ( (e, n, i, t=!0, l=!0) => k("script", i, {
                                    src: e,
                                    id: n,
                                    defer: t,
                                    async: l
                                }))(e, n, i, t, l);
                                o.type = "module",
                                o.onload = r,
                                o.onerror = a;
                                const s = null != i ? i : document
                                  , d = s.getElementById(n);
                                null !== d && d.remove(),
                                s.body.appendChild(o)
                            }
                            )(e, n, i, !1, !1, (n => {
                                console.debug(`Script loaded: ${e}`, n),
                                t()
                            }
                            ), (n => {
                                console.error(`Script error: ${e}`, n),
                                l()
                            }
                            ))
                        } catch (n) {
                            console.error(`Script error: ${e}`, n),
                            l(n)
                        }
                    }
                    ))
                }
                )))(i, e.elementName, t);
                const l = await R(e.elementName, t);
                return console.debug("loaded config from source url is:", l),
                l
            } catch (e) {
                throw console.error(e),
                Error(j.Z.t("plugins.errors.api.scriptError"))
            } finally {
                A(n)
            }
        }
          , R = async (e, n) => {
            const i = k(e, n).constructor;
            if (i && i.getMetaConfig) {
                const e = i.getMetaConfig();
                if (e)
                    return Promise.resolve(e)
            }
            return Promise.reject(new Error(j.Z.t("plugins.errors.api.scriptError")))
        }
        ;
        var O = i(93827);
        const z = ["action", "label"];
        var M = function(e) {
            return e.Local = "http://localhost:9055",
            e.Test = "nintextest.io",
            e.Prod = "nintex.io",
            e.Staging = "nintexstaging.io",
            e
        }(M || {});
        const I = e => e.includes(M.Test) || e.includes(M.Local) ? "G-ZWQXNM0ZB5" : e.includes(M.Prod) ? "G-K2EGD5BY50" : e.includes(M.Staging) ? "G-R7RM2QLCYX" : "";
        var Z = i(36566);
        const $ = e => {
            const {isAdmin: n} = e
              , {t: i} = (0,
            o.$G)("pluginManager");
            return (0,
            s.jsxs)("div", {
                className: "nx-plugin-manager-placeholder",
                "data-test-id": "plugin-manager-disabled",
                children: [(0,
                s.jsx)(t.SvgIcon, {
                    icon: "error"
                }), (0,
                s.jsx)("h3", {
                    "data-test-id": "plugin-manager-disabled-header",
                    children: i("plugins.list.formDisabled")
                }), (0,
                s.jsx)("p", {
                    "data-test-id": "plugin-manager-disabled-text",
                    children: i("plugins.list.formsText")
                }), (0,
                s.jsx)("p", {
                    children: n ? (0,
                    s.jsx)("span", {
                        "data-test-id": "plugin-manager-disabled-subtext-admin",
                        children: (0,
                        s.jsx)(o.cC, {
                            i18nKey: "plugins.list.formEnable",
                            t: i,
                            components: [(0,
                            s.jsxs)("a", {
                                "data-test-id": "plugin-manager-settings-link",
                                href: "/dashboard/settings/forms",
                                children: [" ", "Form settings"]
                            })]
                        })
                    }) : (0,
                    s.jsx)("span", {
                        "data-test-id": "plugin-manager-disabled-subtext-non-admin",
                        children: i("plugins.list.formsNotAdmin")
                    })
                })]
            })
        }
          , H = e => {
            const {isPluginsDisabled: n, readOnlyView: i, isAdmin: l} = e
              , {t: r} = (0,
            o.$G)("pluginManager")
              , a = r("plugins.list.formsText") + r("plugins.header.readOnlyHeading");
            return n ? (0,
            s.jsx)($, {
                isAdmin: l
            }) : (0,
            s.jsxs)("div", {
                className: "nx-plugin-manager-placeholder",
                "data-test-id": "plugin-manager-empty-state",
                children: [(0,
                s.jsx)(t.SvgIcon, {
                    icon: "street-sign"
                }), i ? (0,
                s.jsx)("p", {
                    "data-test-id": "plugin-manager-empty-state-text",
                    children: a
                }) : (0,
                s.jsxs)(s.Fragment, {
                    children: [(0,
                    s.jsx)("h2", {
                        "data-test-id": "plugin-manager-empty-state-header",
                        children: r("plugins.list.formStart")
                    }), (0,
                    s.jsxs)("div", {
                        "data-test-id": "plugin-manager-empty-state-text",
                        children: [r("plugins.list.formsText"), (0,
                        s.jsx)(d, {})]
                    })]
                })]
            })
        }
        ;
        function V() {
            const e = S()
              , {getTokenAsync: n, apiBaseUrl: i} = e
              , r = (0,
            l.useRef)(null)
              , d = ( () => {
                const {logEvent: e} = ( () => {
                    const e = S()
                      , [n,i] = (0,
                    l.useState)(!1);
                    return n || ( () => {
                        const n = I(e.apiBaseUrl);
                        n && (( ({apiScriptId: e, dataLayerScriptId: n, measurementId: i}) => {
                            const t = k("script");
                            t.setAttribute("id", e);
                            const l = k("script");
                            var r, a;
                            l.setAttribute("id", n),
                            t.src = `https://www.googletagmanager.com/gtag/js?id=${i}`,
                            t.async = !0,
                            l.innerHTML = " window.dataLayer = window.dataLayer || [];\n        function gtag() {\n            dataLayer.push(arguments);\n        }\n        gtag('js', new Date());\n        ",
                            document.getElementById(e) && (null == (r = document.getElementById(e)) || r.remove()),
                            document.getElementById(n) && (null == (a = document.getElementById(n)) || a.remove());
                            const {firstElementChild: o} = Array.from(document.querySelectorAll("head"))[0];
                            o && (o.before(l),
                            o.before(t))
                        }
                        )({
                            apiScriptId: "nintexPluginManagerGoogleAnalyticScript",
                            dataLayerScriptId: "nintexPluginManagerGoogleAnalyticsFunctionScript",
                            measurementId: n
                        }),
                        gtag("config", n, {
                            cookie_flags: "secure;samesite=none"
                        }),
                        gtag("set", "user_properties", {
                            tenantId: e.tenantId
                        }),
                        i(!0),
                        console.debug("GA initialized"))
                    }
                    )(),
                    {
                        logEvent: (e, i) => {
                            if (!n)
                                return;
                            const {action: t, label: l} = i
                              , r = (0,
                            O.Z)(i, z);
                            gtag("event", t, Object.assign({
                                event_category: e,
                                event_label: l
                            }, r))
                        }
                    }
                }
                )();
                return (n, {action: i, plugin: t, user: l, reason: r}) => {
                    e(n, {
                        action: `${i} plugin`,
                        label: `${i}-plugin`,
                        controlName: t.controlName,
                        description: t.description,
                        elementName: t.elementName,
                        sourceUrl: t.sourceUrl,
                        pluginId: t.pluginId,
                        tenantId: null == l ? void 0 : l.tenantId,
                        userId: null == l ? void 0 : l.id,
                        reason: r
                    })
                }
            }
            )()
              , {t: c} = (0,
            o.$G)("pluginManager")
              , g = c("plugins.errors.api.configNotFound")
              , m = c("plugins.errors.api.scriptError")
              , h = c("plugins.errors.api.nameNotFound")
              , b = c("plugins.errors.api.nameMaxLength")
              , v = c("plugins.errors.api.connectionError")
              , x = c("plugins.errors.api.fetchSettingsError")
              , N = c("plugins.errors.api.retrieveError")
              , [D,A] = (0,
            l.useState)("none")
              , [R,M] = (0,
            l.useState)((0,
            a.Z)())
              , [$,V] = (0,
            l.useState)(!1)
              , [G,q] = (0,
            l.useState)()
              , [J,K] = (0,
            l.useState)([])
              , [Q,Y] = (0,
            l.useState)(!1)
              , [W,X] = (0,
            l.useState)("")
              , [ee,ne] = (0,
            l.useState)({
                showDialog: !1,
                dialogConfig: void 0
            })
              , [ie,te] = (0,
            l.useState)()
              , [le,re] = (0,
            l.useState)({
                showOverlay: !1,
                context: ""
            })
              , [ae,oe] = (0,
            l.useState)(!1)
              , [se,de] = (0,
            l.useState)(!1)
              , [ue,ce] = (0,
            l.useState)("")
              , ge = ( () => {
                const e = S()
                  , [n,i] = (0,
                l.useState)(void 0)
                  , t = (0,
                l.useCallback)((async () => {
                    try {
                        const n = await e.getTokenAsync();
                        i((0,
                        Z.Dm)(n))
                    } catch (e) {
                        console.error(e),
                        i(void 0)
                    }
                }
                ), [e]);
                return (0,
                l.useEffect)(( () => {
                    t()
                }
                ), [t]),
                n
            }
            )()
              , me = se || !(0,
            Z.yq)(ge, [Z.i4.automationAdmin, Z.i4.globalAdmin, Z.i4.developer])
              , pe = (0,
            f.cI)({
                mode: "onChange",
                defaultValues: {
                    description: "",
                    elementName: "",
                    sourceUrl: "",
                    controlName: "",
                    file: void 0,
                    hostedBy: "file"
                }
            })
              , fe = () => {
                M((0,
                a.Z)()),
                A("none"),
                pe.reset({
                    description: "",
                    elementName: "",
                    sourceUrl: "",
                    controlName: "",
                    file: void 0
                }),
                q(void 0),
                V(!1),
                oe(!1),
                te(void 0)
            }
            ;
            var he, be;
            he = r,
            be = fe,
            (0,
            l.useEffect)(( () => {
                const e = e => {
                    he.current && !he.current.contains(e.target) && be()
                }
                ;
                return document.addEventListener("mousedown", e),
                () => {
                    document.removeEventListener("mousedown", e)
                }
            }
            ), [he, be]);
            const ve = e => {
                var n, i, t, l;
                const r = J.find((n => n.id === e));
                r && (te(r.id),
                A("main"),
                oe(!0),
                q(void 0),
                pe.reset({
                    description: r.description,
                    elementName: r.elementName,
                    sourceUrl: r.sourceUrl,
                    controlName: r.controlName,
                    hostedBy: null != (n = r.hostedBy) ? n : "url",
                    file: r.file && {
                        name: null == (i = r.file) ? void 0 : i.fileName,
                        size: null == (t = r.file) ? void 0 : t.size,
                        type: null == (l = r.file) ? void 0 : l.mimetype
                    }
                }))
            }
              , xe = ( (e, n, i=!0, t, l) => e.map((e => {
                var r;
                return {
                    controlName: {
                        component: "name",
                        value: e.controlName,
                        isNew: n === e.id,
                        onClick: () => t(e.id)
                    },
                    elementName: e.elementName,
                    description: e.description,
                    groupName: null == (r = e.contract) ? void 0 : r.groupName,
                    id: e.id,
                    createdBy: `${e.createdBy.firstName} ${e.createdBy.lastName}`,
                    file: e.file,
                    createdDate: {
                        component: "date",
                        format: "d MMM yyyy - h:mm a",
                        value: e.createDate
                    },
                    sourceUrl: e.sourceUrl,
                    status: {
                        component: "status",
                        value: e.isDisabled ? j.Z.t("general.disabled") : j.Z.t("general.enabled"),
                        isDisabled: !!e.isDisabled
                    },
                    hostedBy: {
                        originalValue: e.hostedBy,
                        value: "file" === e.hostedBy ? j.Z.t("general.nintex") : j.Z.t("general.url")
                    },
                    [L.vy]: E(e, i),
                    [L.$M]: e.id === l
                }
            }
            )))(J, ue, me, ve, ie)
              , Ne = (0,
            l.useCallback)((async () => {
                Y(!0);
                try {
                    const e = await ( (e, n) => n().then((n => fetch(U(e, "/api/v1/settings"), {
                        method: "GET",
                        headers: {
                            authorization: `Bearer ${n}`,
                            "Content-Type": "application/json"
                        }
                    }))).then(F).catch((e => {
                        throw console.error(e),
                        e
                    }
                    )))(i, n);
                    if (null == e || !e.enablePlugins)
                        return de(!0),
                        void Y(!1)
                } catch (e) {
                    return X(x),
                    void Y(!1)
                }
                try {
                    const e = await ( (e, n) => n().then((n => {
                        if (!n)
                            throw Error(j.Z.t("plugins.errors.api.tokenError"));
                        return fetch(U(e, P), {
                            method: "GET",
                            headers: {
                                Authorization: `Bearer ${n}`
                            }
                        })
                    }
                    )).then((e => F(e))).catch((e => {
                        throw console.error(e),
                        e
                    }
                    )))(i, n);
                    K(e.formPlugins)
                } catch (e) {
                    console.error(e),
                    X(N)
                }
                Y(!1)
            }
            ), [x, N, i, n])
              , ye = async (n, i) => {
                "delete" !== n ? "disable" !== n || Se("disable", i) : (async n => {
                    re({
                        showOverlay: !0,
                        context: "Deleting plugin"
                    });
                    const i = w(n);
                    try {
                        await (r = e,
                        a = n.id,
                        r.getTokenAsync().then((e => {
                            if (!e)
                                throw Error(j.Z.t("plugins.errors.api.tokenError"));
                            return fetch(U(r.apiBaseUrl, `${P}/${a}`), {
                                method: "DELETE",
                                headers: {
                                    authorization: `Bearer ${e}`,
                                    "Content-Type": "application/json"
                                }
                            })
                        }
                        )).then((e => F(e))).catch((e => {
                            throw console.error(e),
                            e
                        }
                        ))),
                        (0,
                        t.createToast)({
                            type: "success",
                            content: j.Z.t("plugins.actions.deleteSuccess")
                        }),
                        d("pluginManagerDeleteSuccess", {
                            action: "delete",
                            user: ge,
                            plugin: i
                        }),
                        await Ne(),
                        ne({
                            showDialog: !1
                        })
                    } catch (e) {
                        var l;
                        const n = null != (l = null == e ? void 0 : e.title) ? l : v;
                        (0,
                        t.createToast)({
                            type: "danger",
                            content: n
                        }),
                        d("pluginManagerDeleteError", {
                            action: "delete",
                            user: ge,
                            plugin: i,
                            reason: n
                        })
                    } finally {
                        re({
                            showOverlay: !1,
                            context: ""
                        })
                    }
                    var r, a
                }
                )(i)
            }
              , De = () => {
                ne({
                    showDialog: !1
                }),
                te(void 0)
            }
              , Se = async (n, i) => {
                re({
                    showOverlay: !0,
                    context: ("disable" === n ? "Disabling" : "Enabling") + " plugin"
                });
                const l = w(i);
                try {
                    const r = {
                        isDisabled: "disable" === n
                    };
                    await (a = e,
                    o = i.id,
                    s = r,
                    void a.getTokenAsync().then((e => {
                        if (!e)
                            throw Error("Token is not provided");
                        return fetch(U(a.apiBaseUrl, `${P}/${o}`), {
                            method: "PATCH",
                            headers: {
                                authorization: `Bearer ${e}`,
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(s)
                        })
                    }
                    )).then((e => F(e))).catch((e => {
                        throw console.error(e),
                        e
                    }
                    ))),
                    ne({
                        showDialog: !1
                    }),
                    (0,
                    t.createToast)({
                        type: "success",
                        content: `Plugin successfully ${"disable" === n ? "disabled" : "enabled"}.`
                    }),
                    d("disable" === n ? "pluginManagerDisableSuccess" : "pluginManagerEnableSuccess", {
                        action: n,
                        user: ge,
                        plugin: l
                    }),
                    await Ne()
                } catch (e) {
                    var r;
                    const i = null != (r = null == e ? void 0 : e.title) ? r : v;
                    (0,
                    t.createToast)({
                        type: "danger",
                        content: i
                    }),
                    d("disable" === n ? "pluginManagerDisableError" : "pluginManagerEnableError", {
                        action: n,
                        user: ge,
                        plugin: l,
                        reason: i
                    })
                } finally {
                    re({
                        showOverlay: !1,
                        context: ""
                    }),
                    te(void 0)
                }
                var a, o, s
            }
            ;
            (0,
            l.useEffect)(( () => {
                Ne()
            }
            ), [Ne]);
            const Le = (0,
            Z.yq)(ge, [Z.i4.automationAdmin, Z.i4.globalAdmin]);
            return (0,
            s.jsxs)("div", {
                className: "nx-nwc-plugin-manager",
                children: [(0,
                s.jsx)(t.ToastNotificationContainer, {}), ee.dialogConfig && (0,
                s.jsx)(Z.U6, Object.assign({}, ee.dialogConfig, {
                    children: ee.content
                })), (0,
                s.jsx)(t.SlidePanels, {
                    view: D,
                    children: (0,
                    s.jsx)(t.SlidePanels.Main, {
                        children: (0,
                        s.jsx)(f.RV, Object.assign({}, pe, {
                            children: (0,
                            s.jsx)(y, {
                                ref: ae ? r : void 0,
                                title: ae ? j.Z.t("plugins.actions.pluginDetails") : j.Z.t("plugins.actions.addPlugin"),
                                onClose: () => {
                                    fe()
                                }
                                ,
                                handleSubmit: pe.handleSubmit((n => {
                                    (async n => {
                                        if (q(void 0),
                                        !e.apiBaseUrl)
                                            return console.warn(j.Z.t("plugins.errors.api.missingBaseUrl")),
                                            void q(j.Z.t("plugins.errors.api.missingBaseUrl"));
                                        let i;
                                        V(!0);
                                        try {
                                            var t;
                                            if (i = await B(n),
                                            !i)
                                                return q(g),
                                                V(!1),
                                                void d("pluginManagerRegError", {
                                                    action: "register",
                                                    user: ge,
                                                    reason: g,
                                                    plugin: Object.assign({}, n)
                                                });
                                            if (!i.controlName || (null == (t = i) || null == (t = t.controlName) ? void 0 : t.length) > 40) {
                                                var l;
                                                const e = (null == (l = i) || null == (l = l.controlName) ? void 0 : l.length) > 40 ? b : h;
                                                return q(e),
                                                V(!1),
                                                void d("pluginManagerRegError", {
                                                    action: "register",
                                                    user: ge,
                                                    reason: e,
                                                    plugin: Object.assign({}, n)
                                                })
                                            }
                                        } catch (e) {
                                            var r, a, o, s;
                                            return q(null != (r = null == e ? void 0 : e.message) ? r : m),
                                            d("pluginManagerRegError", {
                                                action: "register",
                                                user: ge,
                                                reason: null != (a = null == e ? void 0 : e.message) ? a : m,
                                                plugin: Object.assign({}, n, (null == (o = i) ? void 0 : o.controlName) && {
                                                    controlName: null == (s = i) ? void 0 : s.controlName
                                                })
                                            }),
                                            void V(!1)
                                        }
                                        try {
                                            const t = await C(Object.assign({}, n, {
                                                contract: i,
                                                controlName: i.controlName
                                            }), e);
                                            d("pluginManagerRegSuccess", {
                                                action: "register",
                                                user: ge,
                                                plugin: Object.assign({}, n, {
                                                    pluginId: t.pluginId,
                                                    controlName: i.controlName
                                                })
                                            }),
                                            fe(),
                                            await Ne(),
                                            ce(t.pluginId)
                                        } catch (e) {
                                            var u, c;
                                            console.error(e);
                                            const t = null != (u = null != (c = null == e ? void 0 : e.detail) ? c : null == e ? void 0 : e.title) ? u : v;
                                            q(t),
                                            d("pluginManagerRegError", {
                                                action: "register",
                                                user: ge,
                                                reason: t,
                                                plugin: Object.assign({}, n, {
                                                    contract: i,
                                                    controlName: i.controlName
                                                })
                                            })
                                        } finally {
                                            V(!1)
                                        }
                                    }
                                    )(n)
                                }
                                )),
                                error: G,
                                loading: $,
                                displayMode: ae,
                                disableSubmit: !pe.formState.isValid
                            }, ie || R)
                        }))
                    })
                }), (0,
                s.jsxs)(t.Panel, {
                    title: j.Z.t("plugins.header.title"),
                    children: [!W && J.length > 0 && (0,
                    s.jsx)(u, {
                        isReadOnlyView: me
                    }), (0,
                    s.jsx)(t.PanelCustomExtensionAction, {
                        children: !me && (0,
                        s.jsx)(t.Button, {
                            "data-test-id": "nx-plugin-add-btn",
                            type: "secondary",
                            icon: "add-alt",
                            onClick: () => A("main"),
                            disabled: Q || !!W,
                            children: j.Z.t("plugins.actions.addPlugin")
                        })
                    }), Q || 0 !== J.length || W ? (0,
                    s.jsx)(p, {
                        plugins: xe,
                        loading: Q,
                        loadingError: W,
                        handleRowSelected: ve,
                        handleEnablePlugin: e => {
                            Se("enable", e)
                        }
                        ,
                        setSelectedRowMeatball: te,
                        tableColumns: (je = j.Z,
                        [T(je).controlName, T(je).groupName, T(je).hostedBy, T(je).status, T(je).createdDate, T(je).createdBy]),
                        onDialogAction: (e, n) => {
                            const i = {
                                onDialogConfirm: () => ye(e, n),
                                onDialogCancel: De,
                                showDialog: !0,
                                header: j.Z.t(_.header[e]),
                                noLabel: j.Z.t("general.cancel"),
                                yesLabel: j.Z.t(_.yesLabel[e]),
                                context: _.context[e]
                            }
                              , t = "delete" === e ? _.content.delete(n.controlName.value, "file" === n.hostedBy.originalValue) : _.content[e](n.controlName.value);
                            ne({
                                showDialog: !0,
                                dialogConfig: i,
                                content: t
                            })
                        }
                    }) : (0,
                    s.jsx)(H, {
                        isAdmin: Le,
                        isPluginsDisabled: se,
                        readOnlyView: me
                    }), le.showOverlay && (0,
                    s.jsx)(t.OverlayStatusIndicator, {
                        status: le.context
                    })]
                })]
            });
            var je
        }
        const _ = {
            header: {
                disable: "plugins.actions.disablePlugin",
                delete: "plugins.actions.deletePlugin"
            },
            yesLabel: {
                disable: "plugins.actions.disablePlugin",
                delete: "plugins.actions.deletePlugin"
            },
            context: {
                disable: "disable-plugin",
                delete: "delete-plugin"
            },
            content: {
                delete: (e, n=!1) => (0,
                s.jsxs)("div", {
                    children: [(0,
                    s.jsx)("p", {
                        children: j.Z.t(n ? "plugins.actions.pluginDeleteHosted" : "plugins.actions.pluginDelete")
                    }), (0,
                    s.jsx)("br", {}), n && (0,
                    s.jsx)("p", {
                        children: j.Z.t("plugins.actions.pluginDeleteHostedNote")
                    }), (0,
                    s.jsx)("br", {}), (0,
                    s.jsx)("p", {
                        children: (0,
                        s.jsx)(o.cC, {
                            i18nKey: "plugins.actions.pluginDeleteConfirm",
                            values: {
                                pluginName: e
                            }
                        })
                    })]
                }),
                disable: e => (0,
                s.jsxs)("div", {
                    children: [(0,
                    s.jsx)("p", {
                        children: j.Z.t("plugins.actions.pluginDisable")
                    }), (0,
                    s.jsx)("br", {}), (0,
                    s.jsx)("p", {
                        children: j.Z.t("plugins.actions.pluginDisableNote")
                    }), (0,
                    s.jsx)("br", {}), (0,
                    s.jsx)("p", {
                        children: (0,
                        s.jsx)(o.cC, {
                            i18nKey: "plugins.actions.pluginDisableConfirm",
                            values: {
                                pluginName: e
                            }
                        })
                    })]
                })
            }
        };
        i.e(267).then(i.bind(i, 61267));
        const G = e => (0,
        s.jsxs)(D.Provider, {
            value: e,
            children: [(0,
            s.jsx)(Z.K9, {
                langs: e.langs,
                supportedLangs: Object.keys(Z.lO),
                i18n: j.Z
            }), (0,
            s.jsx)(V, {})]
        })
    }
    ,
    77793: (e, n, i) => {
        i.d(n, {
            Z: () => m
        });
        var t = i(99842);
        const l = JSON.parse('{"general":{"cancel":"إلغاء الأمر","upload":"رفع","disabled":"ذوي الاحتياجات الخاصه","enabled":"تمكين","disable":"تعطيل","enable":"تمكين","nintex":"نينتكس","url":"الرابط","delete":"حذف","viewSource":"عرض المصدر"},"plugins":{"errors":{"input":{"invalidPrefix":"يجب ألا تبدأ أسماء العناصر ب nintex أو ntx أو nwc أو nac.","invalidUrl":"الرجاء إدخال عنوان URL صحيح","invalidFile":"الرجاء تحديد ملف صالح","invalidElementName":"٪0 غير صالح","invalidValue":"الرجاء إدخال قيمة"},"api":{"scriptError":"فشل تحميل تعريف المكون الإضافي.","connectionError":"حدث خطأ في الاتصال أثناء الاتصال\\nمع الخادم الخارجي. يرجى المحاولة مرة أخرى.","configNotFound":"تعذر العثور على عقد مكون إضافي لاسم العنصر هذا.","fetchSettingsError":"حدث خطأ أثناء جلب الإعدادات","retrieveError":"غير قادر على استرداد البيانات","tokenError":"لم يتم توفير الرمز المميز","missingBaseUrl":"لم يتم توفير عنوان URL الأساسي لواجهة برمجة التطبيقات","nameNotFound":"الحقل المطلوب لم يتم العثور على اسم التحكم في تعريف المكون الإضافي.","nameMaxLength":"الحد الأقصى لطول اسم عنصر التحكم الميداني في تعريف المكون الإضافي هو 40.","fileError":"فشل في قراءة الملف.","fileNotFound":"لم يتم العثور على الملف."}},"header":{"title":"شكل الإضافات","readOnlyHeading":" اتصل بالمشرف للحصول على حق الوصول لإنشاء المكونات الإضافية.","info":" أضف مكونا إضافيا عن طريق تحديد عنوان URL حيث استضفت ملفات المكون الإضافي. اقرأ (الرابط) للبدء.","infoPrefix":" أضف مكونا إضافيا عن طريق تحديد عنوان URL حيث استضفت ملفات المكون الإضافي. اقرأ ","infoText":" قم بتحميل مكون إضافي أو حدد عنوان URL حيث قمت باستضافة ملفات المكون الإضافي. اقرأ <0>مجموعة أدوات تطوير البرامج</0> للبدء.","infoLinkText":"مجموعة تطوير البرمجيات","termsText":"باستخدام هذه الميزة ، أقر <0>بالشروط والأحكام</0> المطبقة على استخدام مكونات النموذج الإضافية (\\"الميزة\\").","termsLinkText":"الشروط والأحكام"},"list":{"formDisabled":"تم تعطيل ميزة المكون الإضافي للنموذج.","formsText":"تتيح لك المكونات الإضافية للنموذج إضافة عناصر تحكم ووظائف مخصصة إلى نماذجك.","formEnable":"يمكنك تمكين الميزة في <0>إعدادات النموذج</0>.","formsNotAdmin":"اطلب من المشرف تمكين الميزة.","formStart":"أضف المكون الإضافي الأول للنموذج","notAvailable":"لا توجد مكونات إضافية متاحة"},"formTable":{"control":"اسم عنصر التحكم","group":"اسم المجموعة","createdBy":"تم الإنشاء بواسطة","createdDate":"تاريخ الإنشاء","status":"حالة","hostedBy":"باستضافة"},"actions":{"pluginDelete":"لن تتمكن من إضافة هذا المكون الإضافي إلى النماذج أو نشر النماذج التي تستخدم هذا المكون الإضافي. لا تتأثر النماذج المنشورة بالفعل.","pluginDeleteHosted":"ستتم إزالة هذا المكون الإضافي من مربع أدوات مصمم النماذج ومن أي نموذج منشور حيث تم استخدامه.","pluginDeleteHostedNote":"لن تتمكن من حفظ أو نشر النماذج التي تستخدم هذا المكون الإضافي.","pluginDeleteConfirm":"هل أنت متأكد من أنك تريد حذف المكون الإضافي ٪0؟","pluginDisable":"سيؤدي تعطيل هذا المكون الإضافي إلى إزالته من مربع أدوات مصمم النماذج. لن تتمكن من حفظ أو نشر النماذج التي تستخدم هذا المكون الإضافي.","pluginDisableNote":"لا تتأثر النماذج المنشورة بالفعل.","pluginDisableConfirm":"هل أنت متأكد من أنك تريد تعطيل المكون الإضافي ٪0؟","addPlugin":"إضافة مكون إضافي","deletePlugin":"حذف البرنامج المساعد","deletingPlugin":"حذف البرنامج المساعد","disablePlugin":"تعطيل البرنامج المساعد","disablingPlugin":"تعطيل البرنامج المساعد","pluginDetails":"تفاصيل البرنامج المساعد","deleteSuccess":"تم حذف البرنامج المساعد بنجاح."},"form":{"input":{"urlOption":"ربط عنوان URL","elementName":"اسم العنصر","elementNameTooltip":"اسم عنصر HTML المخصص للمكون الإضافي.","sourceUrl":"عنوان URL المصدر","description":"وصف","controlName":"اسم عنصر التحكم","file":"ملف","fileLabel":"ملف جافا سكريبت"},"fileUpload":{"dropFileLabelText":"أسقط الملف هنا ...","dragFileLabelText":"اسحب الملف هنا أو ","selectFileButtonText":"حدد الملف"},"actions":{"addPlugin":"إضافة مكون إضافي"}}}}')
          , r = JSON.parse('{"general":{"cancel":"Abbrechen","upload":"Hochladen","disabled":"Deaktiviert","enabled":"Aktiviert","disable":"Deaktivieren","enable":"Aktivieren","nintex":"Nintex","url":"URL","delete":"Löschen","viewSource":"Quelle anzeigen"},"plugins":{"errors":{"input":{"invalidPrefix":"Elementnamen dürfen nicht mit nintex, ntx, nwc oder nac beginnen.","invalidUrl":"Bitte geben Sie eine gültige URL ein","invalidFile":"Bitte wählen Sie eine gültige Datei aus","invalidElementName":"{{input}} ist ungültig","invalidValue":"Bitte geben Sie einen Wert ein"},"api":{"scriptError":"Die Plugin-Definition konnte nicht geladen werden.","connectionError":"Bei der Kommunikation mit dem externen Server ist ein Verbindungsfehler aufgetreten. Bitte versuchen Sie es erneut.","configNotFound":"Es konnte kein Plugin-Vertrag für diesen Elementnamen gefunden werden.","fetchSettingsError":"Fehler beim Abrufen von Einstellungen","retrieveError":"Daten können nicht abgerufen werden","tokenError":"Token wird nicht bereitgestellt","missingBaseUrl":"keine API-Basis-URL angegeben","nameNotFound":"Das Pflichtfeld controlName ist in der Plugin-Definition nicht enthalten.","nameMaxLength":"Die maximale Länge des Feldes controlName in der Plugin-Definition beträgt 40.","fileError":"Die Datei konnte nicht gelesen werden.","fileNotFound":"Datei nicht gefunden."}},"header":{"title":"Formular-Plugins","readOnlyHeading":" Wenden Sie sich an Ihren Administrator, um Zugriff zum Erstellen von Plugins zu erhalten.","info":"Fügen Sie ein Plugin hinzu, indem Sie die URL angeben, unter der Sie die Plugin-Dateien gehostet haben. Lesen Sie die (Link), um loszulegen.","infoPrefix":"Fügen Sie ein Plugin hinzu, indem Sie die URL angeben, unter der Sie die Plugin-Dateien gehostet haben. Lesen Sie die","infoText":" Laden Sie ein Plugin hoch oder geben Sie die URL an, unter der Sie die Plugin-Dateien gehostet haben. Lesen Sie das <0>Software Development Kit</0> , um loszulegen.","infoLinkText":"Software Development Kit","termsText":"Durch die Nutzung dieser Funktion erkenne ich die <0>Allgemeinen Geschäftsbedingungen</0> an, die für die Nutzung von Formular-Plugins (die \\"Funktion\\") gelten.","termsLinkText":"Allgemeinen Geschäftsbedingungen"},"list":{"formDisabled":"Die Formular-Plugin-Funktion ist deaktiviert.","formsText":"Mit Formular-Plugins können Sie Ihren Formularen benutzerdefinierte Steuerungen und Funktionen hinzufügen.","formEnable":"Sie können die Funktion in den <0>Formulareinstellungen</0> aktivieren.","formsNotAdmin":"Bitten Sie Ihren Administrator, die Funktion zu aktivieren.","formStart":"Fügen Sie Ihr erstes Formular-Plugin hinzu","notAvailable":"Keine verfügbaren Plugins"},"formTable":{"control":"Name der Steuerung","group":"Name der Gruppe","createdBy":"Erstellt von","createdDate":"Erstellungsdatum","status":"Status","hostedBy":"Gehostet von:"},"actions":{"pluginDelete":"Sie können dieses Plugin nicht zu Formularen hinzufügen oder Formulare veröffentlichen, die dieses Plugin verwenden. Bereits veröffentlichte Formulare sind davon nicht betroffen.","pluginDeleteHosted":"Dieses Plugin wird aus Ihrer Formular-Designer-Toolbox und aus allen veröffentlichten Formularen entfernt, in denen es verwendet wurde.","pluginDeleteHostedNote":"Sie können keine Formulare speichern oder veröffentlichen, die dieses Plugin verwenden.","pluginDeleteConfirm":"Wollen Sie den Löschvorgang wirklich durchführen","pluginDisable":"Wenn Sie dieses Plugin deaktivieren, wird es aus Ihrer Formular-Designer-Toolbox entfernt. Sie können Formulare, die dieses Plugin verwenden, nicht speichern oder veröffentlichen.","pluginDisableNote":"Bereits veröffentlichte Formulare sind davon nicht betroffen.","pluginDisableConfirm":"Wollen Sie die Deaktivierung wirklich vornehmen","addPlugin":"Plugin hinzufügen","deletePlugin":"Plugin löschen","deletingPlugin":"Plugin löschen","disablePlugin":"Plugin deaktivieren","disablingPlugin":"Plugin deaktivieren","pluginDetails":"Plugin-Details","deleteSuccess":"Das Plugin wurde erfolgreich gelöscht."},"form":{"input":{"urlOption":"Verknüpfen einer URL","elementName":"Elementname","elementNameTooltip":"Der Name des benutzerdefinierten HTML-Elements des Plugins.","sourceUrl":"Quell-URL","description":"Beschreibung","controlName":"Name der Steuerung","file":"Datei","fileLabel":"JavaScript-Datei"},"fileUpload":{"dropFileLabelText":"Legen Sie die Datei hier ab...","dragFileLabelText":"Datei hierher ziehen oder ","selectFileButtonText":"Datei auswählen"},"actions":{"addPlugin":"Plugin hinzufügen"}}}}')
          , a = JSON.parse('{"general":{"cancel":"Cancel","upload":"Upload","disabled":"Disabled","enabled":"Enabled","disable":"Disable","enable":"Enable","nintex":"Nintex","url":"URL","delete":"Delete","viewSource":"View source"},"plugins":{"errors":{"input":{"invalidPrefix":"Element names must not start with nintex, ntx, nwc, or nac.","invalidUrl":"Please enter a valid URL","invalidFile":"Please select a valid file","invalidElementName":"{{input}} is invalid","invalidValue":"Please enter a value"},"api":{"scriptError":"Failed to load the plugin definition.","connectionError":"A connection error occurred while communicating\\nwith the external server. Please try again.","configNotFound":"Unable to find a plugin contract for that element name.","fetchSettingsError":"Error while fetching settings","retrieveError":"Unable to retrieve data","tokenError":"Token is not provided","missingBaseUrl":"no api base url provided","nameNotFound":"Required field controlName is not found in plugin definition.","nameMaxLength":"Maximum length of field controlName in plugin definition is 40.","fileError":"Failed to read file.","fileNotFound":"File not found."}},"header":{"title":"Form plugins","readOnlyHeading":" Contact your administrator for access to create plugins.","info":" Add a plugin by specifying the URL where you hosted the plugin files. Read the (link) to get started.","infoPrefix":" Add a plugin by specifying the URL where you hosted the plugin files. Read the ","infoText":" Upload a plugin or specify the URL where you hosted the plugin files. Read the <0>Software development kit</0> to get started.","infoLinkText":"Software development kit","termsText":"By using this feature, I acknowledge the <0>Terms and Conditions</0> applicable to use of Form Plugins (the \\"Feature\\").","termsLinkText":"Terms and Conditions"},"list":{"formDisabled":"The form plugin feature is disabled.","formsText":"Form plugins let you add custom controls and functionality to your forms.","formEnable":"You can enable the feature in <0>Form settings</0>.","formsNotAdmin":"Ask your administrator to enable the feature.","formStart":"Add your first form plugin","notAvailable":"No available plugins"},"formTable":{"control":"Control Name","group":"Group Name","createdBy":"Created by","createdDate":"Date created","status":"Status","hostedBy":"Hosted by"},"actions":{"pluginDelete":"You will be unable to add this plugin to forms or publish forms that use this plugin. Already published forms are not affected.","pluginDeleteHosted":"This plugin will be removed from your Forms designer toolbox and from any published form where it was used.","pluginDeleteHostedNote":"You will not be able to save or publish forms that use this plugin.","pluginDeleteConfirm":"Are you sure you want to delete the {{pluginName}} plugin?","pluginDisable":"Disabling this plugin will remove it from your Forms designer toolbox. You will not be able to save or publish forms that use this plugin.","pluginDisableNote":"Already published forms are not affected.","pluginDisableConfirm":"Are you sure you want to disable the {{pluginName}} plugin?","addPlugin":"Add plugin","deletePlugin":"Delete plugin","deletingPlugin":"Deleting Plugin","disablePlugin":"Disable plugin","disablingPlugin":"Disabling Plugin","pluginDetails":"Plugin details","deleteSuccess":"Plugin successfully deleted."},"form":{"input":{"urlOption":"Link a URL","elementName":"Element name","elementNameTooltip":"The name of the plugin\'s custom HTML element.","sourceUrl":"Source URL","description":"Description","controlName":"Control name","file":"File","fileLabel":"JavaScript file"},"fileUpload":{"dropFileLabelText":"Drop the file here...","dragFileLabelText":"Drag file here or ","selectFileButtonText":"Select file"},"actions":{"addPlugin":"Add plugin"}}}}')
          , o = JSON.parse('{"general":{"cancel":"Cancelar","upload":"Subir","disabled":"Deshabilitado","enabled":"Habilitado","disable":"Deshabilitar","enable":"Habilitar","nintex":"Nintex","url":"URL","delete":"Eliminar","viewSource":"Ver origen"},"plugins":{"errors":{"input":{"invalidPrefix":"Los nombres de los elementos no deben comenzar por nintex, ntx, nwc o nac.","invalidUrl":"Introduzca una URL válida.","invalidFile":"Seleccione un archivo válido.","invalidElementName":"{{input}} no es válido.","invalidValue":"Introduzca un valor."},"api":{"scriptError":"No se ha podido cargar la definición del complemento.","connectionError":"Se ha producido un error de conexión durante la comunicación con el servidor externo. Inténtelo de nuevo.","configNotFound":"No se ha podido encontrar un contrato de complemento para ese nombre de elemento.","fetchSettingsError":"Error al obtener la configuración","retrieveError":"No se han podido recuperar los datos.","tokenError":"No se ha proporcionado el token.","missingBaseUrl":"No se ha proporcionado ninguna URL base de API.","nameNotFound":"El campo obligatorio controlName no se encuentra en la definición del complemento.","nameMaxLength":"La longitud máxima del campo controlName en la definición del complemento es de 40 caracteres.","fileError":"Error al leer el archivo.","fileNotFound":"Archivo no encontrado."}},"header":{"title":"Complementos de formulario","readOnlyHeading":" Póngase en contacto con su administrador para obtener acceso para crear complementos.","info":" Agregue un complemento especificando la URL donde ha alojado los archivos del complemento. Lea (link) para comenzar.","infoPrefix":" Agregue un complemento especificando la URL donde ha alojado los archivos del complemento. Lea el ","infoText":" Cargue un complemento o especifique la URL donde ha alojado los archivos del complemento. Lea el <0>kit de desarrollo de software</0> para comenzar.","infoLinkText":"Kit de desarrollo de software","termsText":"Al utilizar esta función, reconozco los <0>Términos y condiciones</0> aplicables al uso de los complementos de formulario (la \\"Función\\").","termsLinkText":"Términos y condiciones"},"list":{"formDisabled":"La función de complemento de formularios está deshabilitada.","formsText":"Los complementos de formularios le permiten agregar controles personalizados y funcionalidad a sus formularios.","formEnable":"Puede habilitar la función en la <0>configuración del formulario</0>.","formsNotAdmin":"Pida a su administrador que habilite la función.","formStart":"Agregue su primer complemento de formulario.","notAvailable":"No hay complementos disponibles."},"formTable":{"control":"Nombre del control","group":"Nombre del grupo","createdBy":"Creado por","createdDate":"Fecha de creación","status":"Estado","hostedBy":"Anfitrión:"},"actions":{"pluginDelete":"No podrá agregar este complemento a formularios ni publicar formularios que usen este complemento. Los formularios ya publicados no se verán afectados.","pluginDeleteHosted":"Este complemento se eliminará de la caja de herramientas del diseñador de formularios y de cualquier formulario publicado en el que se haya utilizado.","pluginDeleteHostedNote":"No podrá guardar ni publicar formularios que utilicen este complemento.","pluginDeleteConfirm":"¿Seguro que desea eliminar el complemento  {{pluginName}}?","pluginDisable":"Al deshabilitar este complemento, se eliminará de la caja de herramientas del diseñador de formularios. No podrá guardar ni publicar formularios que utilicen este complemento.","pluginDisableNote":"Los formularios ya publicados no se verán afectados.","pluginDisableConfirm":"¿Está seguro de que desea deshabilitar el complemento  {{pluginName}}?","addPlugin":"Añadir plugin","deletePlugin":"Eliminar complemento","deletingPlugin":"Eliminando complemento","disablePlugin":"Desactivar el complemento","disablingPlugin":"Desactivando el complemento","pluginDetails":"Detalles del complemento","deleteSuccess":"El complemento se ha eliminado correctamente."},"form":{"input":{"urlOption":"Vincular una URL","elementName":"Nombre del elemento","elementNameTooltip":"El nombre del elemento HTML personalizado del complemento.","sourceUrl":"URL de origen","description":"Descripción","controlName":"Nombre del control","file":"Archivo","fileLabel":"Archivo JavaScript"},"fileUpload":{"dropFileLabelText":"Suelta el archivo aquí...","dragFileLabelText":"Arrastre el archivo aquí o ","selectFileButtonText":"Seleccionar archivo"},"actions":{"addPlugin":"Agregar plugin"}}}}')
          , s = JSON.parse('{"general":{"cancel":"Annuler","upload":"Télécharger","disabled":"Désactivé","enabled":"Activé","disable":"Désactiver","enable":"Activer","nintex":"Nintex","url":"URL","delete":"Supprimer","viewSource":"Voir la source"},"plugins":{"errors":{"input":{"invalidPrefix":"Les noms d’éléments ne doivent pas commencer par nintex, ntx, nwc ou nac.","invalidUrl":"Veuillez saisir une URL valide","invalidFile":"Veuillez sélectionner un fichier valide","invalidElementName":"{{input}} n’est pas valide","invalidValue":"Veuillez saisir une valeur"},"api":{"scriptError":"Le chargement de la définition du plugin a échoué.","connectionError":"Une erreur de connexion s’est produite lors de la communication\\navec le serveur externe. Veuillez réessayer.","configNotFound":"Impossible de trouver un contrat de plugin pour ce nom d’élément.","fetchSettingsError":"Erreur lors de la récupération des paramètres","retrieveError":"Impossible de récupérer les données","tokenError":"Le jeton n’a pas été fourni","missingBaseUrl":"Aucune URL de base d’API n’a été fournie","nameNotFound":"Le champ obligatoire controlName est introuvable dans la définition du plugin.","nameMaxLength":"La longueur maximale du champ controlName dans la définition du plugin est de 40.","fileError":"La lecture du fichier a échoué.","fileNotFound":"Fichier introuvable."}},"header":{"title":"Plugins de formulaire","readOnlyHeading":" Contactez votre administrateur pour obtenir l’autorisation de créer des plugins.","info":" Ajoutez un plugin en spécifiant l’URL où vous avez hébergé les fichiers de plugin. Lisez le (lien) pour commencer.","infoPrefix":" Ajoutez un plugin en spécifiant l’URL où vous avez hébergé les fichiers de plugin. Lisez le ","infoText":" Téléchargez un plugin ou spécifiez l’URL où vous avez hébergé les fichiers du plugin. Lisez le <0>kit de développement logiciel</0> pour commencer.","infoLinkText":"Kit de développement logiciel","termsText":"En utilisant cette fonctionnalité, je reconnais avoir pris connaissance des <0>conditions générales</0> applicables à l’utilisation des plugins de formulaire (la « fonctionnalité »).","termsLinkText":"Conditions générales"},"list":{"formDisabled":"La fonctionnalité de plugin de formulaire est désactivée.","formsText":"Les plugins de formulaire vous permettent d’ajouter des contrôles et des fonctionnalités personnalisés à vos formulaires.","formEnable":"Vous pouvez activer la fonctionnalité dans les <0>paramètres du formulaire</0>.","formsNotAdmin":"Demandez à votre administrateur d’activer la fonctionnalité.","formStart":"Ajouter votre premier plugin de formulaire","notAvailable":"Aucun plugin disponible"},"formTable":{"control":"Nom du contrôle","group":"Nom du groupe","createdBy":"Créé par","createdDate":"Date de création","status":"Statut","hostedBy":"Hébergeur :"},"actions":{"pluginDelete":"Vous ne pourrez pas ajouter ce plugin à des formulaires ni publier des formulaires qui l’utilisent. Les formulaires déjà publiés ne sont pas concernés.","pluginDeleteHosted":"Ce plugin sera supprimé de votre boîte à outils de conception de formulaire et de tout formulaire publié où il a été utilisé.","pluginDeleteHostedNote":"Vous ne pourrez pas enregistrer ou publier des formulaires qui utilisent ce plugin.","pluginDeleteConfirm":"Êtes-vous sûr de vouloir supprimer le plugin {{pluginName}} ?","pluginDisable":"La désactivation de ce plugin le supprimera de votre boîte à outils de conception de formulaire. Vous ne pourrez pas enregistrer ni publier des formulaires qui utilisent ce plugin.","pluginDisableNote":"Les formulaires déjà publiés ne sont pas concernés.","pluginDisableConfirm":"Êtes-vous sûr de vouloir désactiver le plugin {{pluginName}} ?","addPlugin":"Ajouter un plugin","deletePlugin":"Supprimer un plugin","deletingPlugin":"Suppression du plugin","disablePlugin":"Désactiver un plugin","disablingPlugin":"Désactivation du plugin","pluginDetails":"Détails du plugin","deleteSuccess":"Le plugin a été supprimé avec succès."},"form":{"input":{"urlOption":"Lier une URL","elementName":"Nom d’élément","elementNameTooltip":"Nom de l’élément HTML personnalisé du plugin.","sourceUrl":"URL source","description":"Description","controlName":"Nom du contrôle","file":"Fichier","fileLabel":"Fichier JavaScript"},"fileUpload":{"dropFileLabelText":"Déposer le fichier ici...","dragFileLabelText":"Faire glisser le fichier ici ou ","selectFileButtonText":"Sélectionner un fichier"},"actions":{"addPlugin":"Ajouter un plugin"}}}}')
          , d = JSON.parse('{"general":{"cancel":"キャンセル","upload":"アップロード","disabled":"無効","enabled":"有効","disable":"無効にする","enable":"有効にする","nintex":"Nintex","url":"URL","delete":"削除","viewSource":"ソースを表示"},"plugins":{"errors":{"input":{"invalidPrefix":"要素名をnintex、ntx、nwc、またはnacで始めることはできません。","invalidUrl":"有効なURLを入力してください","invalidFile":"有効なファイルを選択してください","invalidElementName":"{{input}}は無効です","invalidValue":"値を入力してください"},"api":{"scriptError":"プラグイン定義を読み込めませんでした。","connectionError":"外部サーバーとの通信中に接続エラーが\\n発生しました。もう一度お試しください。","configNotFound":"その要素名のプラグインコントラクトが見つかりません。","fetchSettingsError":"設定の取得中にエラーが発生しました","retrieveError":"データを取得できません","tokenError":"トークンが提供されていません","missingBaseUrl":"APIベースURLが指定されていません","nameNotFound":"必須フィールドcontrolNameがプラグイン定義に見つかりません。","nameMaxLength":"プラグイン定義のフィールドcontrolNameの最大長は40です。","fileError":"ファイルの読み取りに失敗しました。","fileNotFound":"ファイルが見つかりません。"}},"header":{"title":"フォームプラグイン","readOnlyHeading":"プラグインを作成するためのアクセス権については、管理者にお問い合わせください。","info":"プラグインファイルをホストしたURLを指定して、プラグインを追加します。まずは(link)をお読みください。","infoPrefix":"プラグインファイルをホストしたURLを指定して、プラグインを追加します。次をお読みください:","infoText":" プラグインをアップロードするか、プラグインファイルをホストしたURLを指定します。 まずは<0>ソフトウェア開発キット</0> をお読みください。","infoLinkText":"ソフトウェア開発キット","termsText":"この機能を使用することにより、私はフォームプラグイン（以下「機能」）の使用に適用される<0>利用規約</0> に同意します。","termsLinkText":"利用規約"},"list":{"formDisabled":"フォームプラグイン機能は無効になっています。","formsText":"フォームプラグインを使用すると、フォームにカスタムコントロールと機能を追加できます。","formEnable":"この機能は、<0>フォーム設定</0>で有効にできます。","formsNotAdmin":"管理者にこの機能を有効にするように依頼してください。","formStart":"最初のフォームプラグインを追加","notAvailable":"利用可能なプラグインがありません"},"formTable":{"control":"コントロール名","group":"グループ名","createdBy":"作成者","createdDate":"作成日","status":"ステータス","hostedBy":"ホスト"},"actions":{"pluginDelete":"このプラグインをフォームに追加したり、このプラグインを使用するフォームを公開したりすることはできません。既に公開されているフォームは影響を受けません。","pluginDeleteHosted":"このプラグインは、フォームデザイナーのツールボックスと、それが使用された公開済みフォームから削除されます。","pluginDeleteHostedNote":"このプラグインを使用するフォームを保存または公開することはできません。","pluginDeleteConfirm":"{{pluginName}}プラグインを削除してもよろしいですか ?","pluginDisable":"このプラグインを無効にすると、フォームデザイナーのツールボックスから削除されます。このプラグインを使用するフォームを保存または公開することはできません。","pluginDisableNote":"既に公開されているフォームは影響を受けません。","pluginDisableConfirm":"{{pluginName}}プラグインを無効にしてもよろしいですか ?","addPlugin":"プラグインを追加","deletePlugin":"プラグインを削除","deletingPlugin":"プラグインの削除","disablePlugin":"プラグインを無効にする","disablingPlugin":"プラグインの無効化","pluginDetails":"プラグインの詳細","deleteSuccess":"プラグインが正常に削除されました。"},"form":{"input":{"urlOption":"URLをリンクする","elementName":"要素名","elementNameTooltip":"プラグインのカスタムHTML要素の名前。","sourceUrl":"ソースURL","description":"説明","controlName":"コントロール名","file":"ファイル","fileLabel":"JavaScriptファイル"},"fileUpload":{"dropFileLabelText":"ここにファイルをドロップしてください...","dragFileLabelText":"ここにファイルをドラッグするか、","selectFileButtonText":"ファイルを選択"},"actions":{"addPlugin":"プラグインを追加"}}}}');
        var u = i(93411);
        const c = {
            ar: {
                pluginManager: l
            },
            de: {
                pluginManager: r
            },
            en: {
                pluginManager: a
            },
            es: {
                pluginManager: o
            },
            fr: {
                pluginManager: s
            },
            ja: {
                pluginManager: d
            }
        }
          , g = (0,
        t.Fs)({
            fallbackLng: "en",
            debug: !0,
            defaultNS: "pluginManager",
            cleanCode: !0,
            lng: "en",
            nonExplicitSupportedLngs: !0,
            resources: c
        });
        g.use(u.Db).init();
        const m = g
    }
    ,
    36566: (e, n, i) => {
        i.d(n, {
            U6: () => o,
            lO: () => p,
            K9: () => m,
            i4: () => u,
            Dm: () => d,
            yq: () => c
        });
        var t = i(37900)
          , l = i.n(t)
          , r = i(47474)
          , a = i(52322);
        const o = ({header: e="", noLabel: n="No", closeButton: i, yesLabel: t="Yes", showDialog: l=!1, context: o, onDialogConfirm: s=( () => null), onDialogCancel: d=( () => null), children: u}) => {
            const c = e => {
                e ? s() : d()
            }
              , g = n ? d : s;
            return (0,
            a.jsxs)(r.Modal, {
                onClose: g,
                size: "small",
                open: l,
                type: "info",
                dataE2e: `${o}-confirmation-dialog`,
                children: [(0,
                a.jsx)(r.ModalHeader, {
                    onClose: g,
                    closeButton: i,
                    children: e
                }), (0,
                a.jsx)(r.ModalBody, {
                    children: u
                }), (0,
                a.jsxs)(r.ModalFooter, {
                    children: [n && (0,
                    a.jsx)(r.Button, {
                        type: "secondary",
                        "data-test-id": `${o}-confirmation-dialog-cancel-btn`,
                        onClick: () => c(!1),
                        children: n
                    }), (0,
                    a.jsx)(r.Button, {
                        type: "danger",
                        "data-test-id": `${o}-confirmation-dialog-confirm-btn`,
                        onClick: () => c(!0),
                        children: t
                    })]
                })]
            })
        }
        ;
        i(56299),
        i(76635),
        i(75810);
        var s = i(51949);
        const d = e => {
            const n = (e => {
                try {
                    return (0,
                    s.Z)(e)
                } catch (e) {
                    return ""
                }
            }
            )(e);
            if (null != n && n.user)
                return null == n ? void 0 : n.user
        }
        ;
        let u = function(e) {
            return e.normalAdmin = "administrator",
            e.globalAdmin = "globalAdmin",
            e.automationAdmin = "automationAdmin",
            e.developer = "developer",
            e.designer = "designer",
            e.participant = "participant",
            e
        }({});
        const c = (e, n) => !(null == e || !e.roles) && e.roles.some((e => n.includes(e)))
          , g = l().createContext({})
          , m = ({langs: e, supportedLangs: n, i18n: i, useQuery: l=!1}) => {
            const r = (0,
            t.useMemo)(( () => {
                var t;
                const r = null == (t = new URLSearchParams(window.location.search).get("langs")) ? void 0 : t.split(",")
                  , a = l && r ? r : e
                  , o = a[0];
                return o && i.language !== o && n.includes(o) && i.changeLanguage(o),
                {
                    langs: a,
                    supportedLangs: n,
                    i18n: i
                }
            }
            ), [i, e, n, l]);
            return (0,
            a.jsx)(g.Provider, {
                value: r
            })
        }
        ;
        let p = function(e) {
            return e.en = "en",
            e.es = "es",
            e.fr = "fr",
            e.de = "de",
            e.ja = "ja",
            e
        }({})
    }
}]);
