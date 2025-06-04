@extends('layouts.app')
@section('title', 'Diskon')
@section('content')
    <div class="page-wrapper">
        <div class="content">
            <div class="page-header">
                <div class="add-item d-flex">
                    <div class="page-title">
                        <h4>DAFTAR NAMPAN</h4>
                    </div>
                </div>
                <ul class="table-top-head">
                    </li>
                    <li>
                        <a data-bs-toggle="tooltip" id="refreshButton" data-bs-placement="top" title="Refresh"><i
                                data-feather="rotate-ccw" class="feather-rotate-ccw"></i></a>
                    </li>
                    <li>
                        <a data-bs-toggle="tooltip" data-bs-placement="top" title="Collapse" id="collapse-header"><i
                                data-feather="chevron-up" class="feather-chevron-up"></i></a>
                    </li>
                </ul>
                <div class="page-btn">
                    <a class="btn btn-added" id="btnTambahNampan"><i data-feather="plus-circle" class="me-2"></i>TAMBAH
                        NAMPAN</a>
                </div>
            </div>

            <div class="card table-list-card">
                <div class="card-body">
                    <div class="table-top">
                        <div class="search-set">
                            <div class="search-input">
                                <a href="javascript:void(0);" class="btn btn-searchset"><i data-feather="search"
                                        class="feather-search"></i></a>
                            </div>
                        </div>
                    </div>

                    <div class="table-responsive product-list">
                        <table id="nampanTable" class="table table-hover" style="width: 100%">
                            <thead class="thead-secondary">
                                <tr>
                                    <th>NO.</th>
                                    <th>NAMPAN</th>
                                    <th>JENIS</th>
                                    <th>STATUS</th>
                                    <th class="no-sort">ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- md Tambah Nampan -->
    <div class="modal fade" id="mdTambahNampan">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="page-title">
                        <h4>TAMBAH NAMPAN</h4>
                    </div>
                    <button type="button" class="close bg-danger text-white fs-16" data-bs-dismiss="modal"
                        aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <form id="formTambahNampan" method="POST" enctype="multipart/form-data">
                    @csrf
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label">NAMPAN<span class="text-danger ms-1">*</span></label>
                            <input type="text" name="nampan" class="form-control">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">JENIS PRODUK</label>
                            <select class="select" name="jenis" id="jenisProduk">
                            </select>
                        </div>
                    </div>
                    <div class="modal-footer d-flex justify-content-between">
                        <button type="button" class="btn me-2 btn-secondary" data-bs-dismiss="modal">BATAL</button>
                        <button type="submit" class="btn btn-primary">SIMPAN</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- md Edit Nampan -->
    <div class="modal fade" id="mdEditNampan">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="page-title">
                        <h4>EDIT NAMPAN</h4>
                    </div>
                    <button type="button" class="close bg-danger text-white fs-16" data-bs-dismiss="modal"
                        aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <form id="formEditNampan" method="POST" enctype="multipart/form-data">
                    @csrf
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label">ID<span class="text-danger ms-1">*</span></label>
                            <input type="text" name="id" id="editid" class="form-control" readonly>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">NAMPAN<span class="text-danger ms-1">*</span></label>
                            <input type="text" name="nampan" id="editnampan" class="form-control">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">JENIS PRODUK</label>
                            <select class="select" name="jenis" id="editJenisProduk">
                            </select>
                        </div>
                    </div>
                    <div class="modal-footer d-flex justify-content-between">
                        <button type="button" class="btn me-2 btn-secondary" data-bs-dismiss="modal">BATAL</button>
                        <button type="submit" class="btn btn-primary">SIMPAN</button>
                    </div>
                </form>
            </div>
        </div>
    </div>



    <!-- Modal Iframe Khusus Content -->
    <div id="popupIframeContent" class="custom-modal-content-area">
        <div class="popup-inner">
            <button type="button" class="btn btn-sm btn-soft-danger rounded-pill close-button" id="closeFrame"> CLOSE
                <span data-feather="x-circle"></span>
            </button>
            <div class="iframe-wrapper">
                <iframe src="" id="iframePage" frameborder="0"></iframe>
            </div>
        </div>
    </div>

    <style>
        .custom-modal-content-area {
            position: fixed;
            top: 66px;
            /* Sesuaikan dengan header */
            left: 260px;
            /* Sesuaikan dengan sidebar */
            width: calc(100% - 260px);
            /* Lebar konten tanpa sidebar */
            height: calc(100% - 66px);
            /* Tinggi konten tanpa header */
            background: #FAFBFE;
            z-index: 9999;
            display: none;
            /* Awalnya sembunyi */
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        }

        .popup-inner {
            position: relative;
            width: 100%;
            height: 100%;
        }

        .close-button {
            position: absolute;
            top: 10px;
            right: 10px;
            background: transparent;
            border: none;
            font-size: 24px;
            font-weight: bold;
            cursor: pointer;
            z-index: 10000;
            /* pastikan berada di atas iframe */
        }

        #iframePage {
            width: 100%;
            height: 100%;
            border: none;
        }

        .iframe-wrapper {
            width: 100%;
            height: 100%;
            padding: 20px;
            padding-top: 50px;
            /* atau sesuai kebutuhan */
            box-sizing: border-box;
        }
    </style>
    <script src="{{ asset('assets/js/jquery-3.7.1.min.js') }}" type="text/javascript"></script>
    <script src="{{ asset('assets/js/pages/master/nampan.js') }}"></script>
@endsection
