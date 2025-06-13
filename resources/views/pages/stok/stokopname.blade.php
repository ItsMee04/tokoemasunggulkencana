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
                        <div class="sidebars settings-sidebar mb-2" id="sidebar2"
                            style="height: 100vh; overflow-y: auto; position: sticky; top: 0;">
                            <div class="sidebar-inner p-3">
                                <div class="modal-body">
                                    <div class="mb-4">
                                        <h6 class="mb-2">NAMPAN</h6>
                                        <select class="form-select" name="nampan" id="nampan"></select>
                                    </div>

                                    <div id="liststokopname" class="mb-4">
                                        <h6 class="mb-2">Data Stok Opname</h6>
                                        <ul class="list-group" id="list-so" style="max-height: 250px; overflow-y: auto;">
                                            <!-- List diisi JS -->
                                        </ul>
                                        <div class="text-center mt-2" id="info-so" style="font-size: 14px;"></div>
                                        <nav aria-label="Page navigation" class="mt-2">
                                            <ul class="pagination justify-content-center" id="pagination-so"></ul>
                                        </nav>
                                    </div>

                                    <div>
                                        <h6>Buat Periode Baru</h6>
                                        <form id="formCreateOpname">
                                            <div class="mb-3">
                                                <label for="periode" class="form-label">Periode</label>
                                                <input type="month" class="form-control" id="periode" name="periode">
                                            </div>
                                            <div class="d-grid mb-2">
                                                <button type="submit" class="btn btn-secondary">Create</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div class="settings-page-wrap">
                            <form action="general-settings.html">
                                <div class="setting-title">
                                    <h4>Profile Settings</h4>
                                </div>
                                <div class="card-title-head">
                                    <h6><span><i data-feather="user" class="feather-chevron-up"></i></span>Employee
                                        Information</h6>
                                </div>
                                <div class="profile-pic-upload">
                                    <div class="profile-pic">
                                        <span><i data-feather="plus-circle" class="plus-down-add"></i> Profile
                                            Photo</span>
                                    </div>
                                    <div class="new-employee-field">
                                        <div class="mb-0">
                                            <div class="image-upload mb-0">
                                                <input type="file">
                                                <div class="image-uploads">
                                                    <h4>Change Image</h4>
                                                </div>
                                            </div>
                                            <span>For better preview recommended size is 450px x 450px. Max size
                                                5MB.</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-4">
                                        <div class="mb-3">
                                            <label class="form-label">First Name</label>
                                            <input type="text" class="form-control">
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="mb-3">
                                            <label class="form-label">Last Name</label>
                                            <input type="text" class="form-control">
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="mb-3">
                                            <label class="form-label">User Name</label>
                                            <input type="text" class="form-control">
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="mb-3">
                                            <label class="form-label">Phone Number</label>
                                            <input type="text" class="form-control">
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="mb-3">
                                            <label class="form-label">Email</label>
                                            <input type="email" class="form-control">
                                        </div>
                                    </div>
                                </div>
                                <div class="card-title-head">
                                    <h6><span><i data-feather="map-pin" class="feather-chevron-up"></i></span>Our
                                        Address</h6>
                                </div>
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="mb-3">
                                            <label class="form-label">Address</label>
                                            <input type="email" class="form-control">
                                        </div>
                                    </div>
                                    <div class="col-xl-3 col-lg-4 col-md-3">
                                        <div class="mb-3">
                                            <label class="form-label">Country</label>
                                            <input type="text" class="form-control">
                                        </div>
                                    </div>
                                    <div class="col-xl-3 col-lg-4 col-md-3">
                                        <div class="mb-3">
                                            <label class="form-label">State / Province</label>
                                            <input type="text" class="form-control">
                                        </div>
                                    </div>
                                    <div class="col-xl-3 col-lg-4 col-md-3">
                                        <div class="mb-3">
                                            <label class="form-label">City</label>
                                            <input type="text" class="form-control">
                                        </div>
                                    </div>
                                    <div class="col-xl-3 col-lg-4 col-md-3">
                                        <div class="mb-3">
                                            <label class="form-label">Postal Code</label>
                                            <input type="text" class="form-control">
                                        </div>
                                    </div>
                                </div>
                                <div class="text-end settings-bottom-btn">
                                    <button type="button" class="btn btn-cancel me-2">Cancel</button>
                                    <button type="submit" class="btn btn-submit">Save Changes</button>
                                </div>
                            </form>
                        </div>
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
