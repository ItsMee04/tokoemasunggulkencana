@extends('layouts.app')
@section('title', 'Stok Nampan')
@section('content')
    <div class="page-wrapper">
        <div class="content settings-content">
            <div class="page-header settings-pg-header">
                <div class="add-item d-flex">
                    <div class="page-title">
                        <h4>Settings</h4>
                        <h6>Manage your settings on portal</h6>
                    </div>
                </div>
                <ul class="table-top-head">
                    <li>
                        <a data-bs-toggle="tooltip" data-bs-placement="top" title="Refresh"><i data-feather="rotate-ccw"
                                class="feather-rotate-ccw"></i></a>
                    </li>
                    <li>
                        <a data-bs-toggle="tooltip" data-bs-placement="top" title="Collapse" id="collapse-header"><i
                                data-feather="chevron-up" class="feather-chevron-up"></i></a>
                    </li>
                </ul>
            </div>
            <div class="row">
                <div class="col-xl-12">
                    <div class="settings-wrapper d-flex">
                        <!-- Sidebar -->
                        <div class="sidebars settings-sidebar border p-3 rounded" id="sidebar2">
                            <div class="sidebar-inner slimscroll">
                                <!-- Select Nampan -->
                                <div class="mb-4">
                                    <h6 class="mb-2">NAMPAN</h6>
                                    <select class="select" name="nampan" id="nampan">
                                        <option value="">Pilih Nampan</option>
                                        <!-- Diisi oleh JS -->
                                    </select>
                                </div>

                                <!-- List Stok Opname -->
                                <div id="liststokopname">
                                    <div class="mb-4">
                                        <h6 class="mb-2">Data Stok Opname</h6>
                                        <ul class="list-group" id="list-so" style="max-height: 250px; overflow-y: auto;">
                                            <!-- Diisi oleh JS -->
                                        </ul>

                                        <!-- Info jumlah -->
                                        <div class="text-center mt-2" id="info-so" style="font-size: 14px;"></div>

                                        <!-- Pagination -->
                                        <nav aria-label="Page navigation" class="mt-2">
                                            <ul class="pagination justify-content-center mb-0" id="pagination-so">
                                                <!-- Diisi oleh JS -->
                                            </ul>
                                        </nav>
                                    </div>
                                </div>

                                <!-- Form Buat Periode -->
                                <div>
                                    <h6>Buat Periode Baru</h6>
                                    <form id="formCreateOpname">
                                        <div class="mb-3">
                                            <label for="periode" class="form-label">Periode</label>
                                            <input type="date" class="form-control" id="periode" name="periode">
                                        </div>
                                        <div class="d-grid">
                                            <button type="submit" class="btn btn-secondary">Create</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <!-- Konten Utama -->
                        <div class="settings-page-wrap w-50">
                            <div class="row">
                                <div class="col-lg-12">
                                    <div class="card table-list-card">
                                        <div class="card-body">
                                            <div class="table-top">
                                                <div class="search-set">
                                                    <div class="search-input">
                                                        <a href class="btn btn-searchset"><i data-feather="search"
                                                                class="feather-search"></i></a>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="table-responsive">
                                                <table id="produkStokNampan" class="table table-hover" style="width: 100%">
                                                    <thead>
                                                        <tr>
                                                            <th>KODE PRODUK</th>
                                                            <th>NAMA</th>
                                                            <th>JENIS</th>
                                                            <th>TANGGAL MASUK</th>
                                                            <th>TANGGAL KELUAR</th>
                                                            <th class="no-sort">Action</th>
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
                        </div>
                        <!-- End Konten Utama -->
                    </div>
                </div>
            </div>

        </div>
    </div>

    <style>
        #list-so {
            height: 250px;
            /* atau pakai min-height: 250px untuk lebih fleksibel */
            overflow-y: auto;
        }

        .list-placeholder {
            opacity: 0;
            pointer-events: none;
        }
    </style>
    <script src="{{ asset('assets/js/jquery-3.7.1.min.js') }}" type="text/javascript"></script>
    <script src="{{ asset('assets/js/pages/stok/stokopname.js') }}"></script>
@endsection
